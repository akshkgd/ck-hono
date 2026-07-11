import { EnrollmentRepository, type NewEnrollment } from '../../enrollments/enrollment.repository.js';
import { UserRepository } from '../../users/user.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import { PaymentRepository } from '../../payments/payment.repository.js';
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
  EnrollmentSearchQueryInput
} from '../../enrollments/enrollment.validation.js';

export class AdminEnrollmentsService {
  private enrollmentRepository: EnrollmentRepository;
  private userRepository: UserRepository;
  private batchRepository: BatchRepository;
  private paymentRepository: PaymentRepository;

  constructor() {
    this.enrollmentRepository = new EnrollmentRepository();
    this.userRepository = new UserRepository();
    this.batchRepository = new BatchRepository();
    this.paymentRepository = new PaymentRepository();
  }

  public async createEnrollment(input: CreateEnrollmentInput) {
    // 1. Verify User Exists
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Verify Batch Exists
    const batch = await this.batchRepository.findById(input.batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }

    // 3. Verify Certificate ID Uniqueness
    if (input.certificateId) {
      const existingCert = await this.enrollmentRepository.findByCertificateId(input.certificateId);
      if (existingCert) {
        throw new Error('Certificate ID already in use');
      }
    }

    // 4. Create record (parsing date strings to Date objects)
    const newEnrollment = await this.enrollmentRepository.create({
      ...input,
      amountPaid: input.amountPaid ?? 0,
      paidAt: input.paidAt ? new Date(input.paidAt) : null,
      certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : null,
      startedAt: input.startedAt ? new Date(input.startedAt) : null,
    });

    // Automatically create a matching transaction in batch_enrollment_payments if amountPaid > 0
    if (newEnrollment.amountPaid > 0) {
      await this.paymentRepository.create({
        batchEnrollmentId: newEnrollment.id,
        amount: newEnrollment.amountPaid,
        paidAt: newEnrollment.paidAt ?? new Date(),
        paymentMethod: newEnrollment.paymentMethod || 'Manual',
        transactionId: newEnrollment.transactionId || `tx-init-${newEnrollment.id}-${Date.now()}`,
        invoiceId: newEnrollment.invoiceId || `inv-init-${newEnrollment.id}-${Date.now()}`,
        purpose: 'enrollment',
        isGstApplicable: true,
        remarks: newEnrollment.remark || 'Logged automatically on enrollment creation',
      });
      // Recalculate to ensure everything, including status, is perfectly in sync
      await this.enrollmentRepository.recalculateAmountPaid(newEnrollment.id);
      
      // Fetch the updated enrollment to return it with the updated state
      const updatedEnrollment = await this.enrollmentRepository.findById(newEnrollment.id);
      if (updatedEnrollment) {
        return updatedEnrollment;
      }
    }

    return newEnrollment;
  }

  public async searchEnrollments(input: EnrollmentSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const enrollments = await this.enrollmentRepository.search(
      input.q,
      input.limit,
      offset,
      input.batchId,
      input.userId,
      input.paymentStatus,
      input.sortBy,
      input.sortOrder
    );
    const total = await this.enrollmentRepository.count(
      input.q,
      input.batchId,
      input.userId,
      input.paymentStatus
    );

    return {
      enrollments,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }

  public async getEnrollment(id: number) {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const startDate = enrollment.startedAt 
      ? new Date(enrollment.startedAt) 
      : (enrollment.paidAt ? new Date(enrollment.paidAt) : new Date(enrollment.createdAt));

    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

    return {
      ...enrollment,
      daysPassed,
    };
  }

  public async updateEnrollment(id: number, input: UpdateEnrollmentInput) {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    if (input.userId) {
      const user = await this.userRepository.findById(input.userId);
      if (!user) {
        throw new Error('User not found');
      }
    }

    if (input.batchId) {
      const batch = await this.batchRepository.findById(input.batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }
    }

    if (input.certificateId && input.certificateId !== enrollment.certificateId) {
      const existingCert = await this.enrollmentRepository.findByCertificateId(input.certificateId);
      if (existingCert) {
        throw new Error('Certificate ID already in use');
      }
    }

    const updated = await this.enrollmentRepository.update(id, {
      ...input,
      amountPaid: input.amountPaid ?? undefined,
      paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
      certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : undefined,
      startedAt: input.startedAt ? new Date(input.startedAt) : undefined,
    });

    if (!updated) {
      throw new Error('Failed to update enrollment');
    }

    // Automatically synchronize transaction logs if amountPaid is modified directly
    if (input.amountPaid !== undefined && input.amountPaid !== enrollment.amountPaid) {
      const diff = input.amountPaid - enrollment.amountPaid;
      if (diff !== 0) {
        await this.paymentRepository.create({
          batchEnrollmentId: id,
          amount: Math.abs(diff),
          paidAt: input.paidAt ? new Date(input.paidAt) : new Date(),
          paymentMethod: input.paymentMethod || enrollment.paymentMethod || 'Manual',
          transactionId: input.transactionId || `tx-update-${id}-${Date.now()}`,
          invoiceId: input.invoiceId || `inv-update-${id}-${Date.now()}`,
          purpose: diff > 0 ? 'enrollment' : 'refund',
          isGstApplicable: true,
          remarks: input.remark || `Logged automatically on enrollment update (amountPaid changed from ${enrollment.amountPaid} to ${input.amountPaid})`,
        });
        
        // Recalculate enrollment total & status
        await this.enrollmentRepository.recalculateAmountPaid(id);
        
        // Return refreshed enrollment
        const refreshed = await this.enrollmentRepository.findById(id);
        if (refreshed) {
          return refreshed;
        }
      }
    }

    return updated;
  }

  public async deleteEnrollment(id: number) {
    const enrollment = await this.enrollmentRepository.findById(id);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }
    await this.enrollmentRepository.delete(id);
    return true;
  }
}
