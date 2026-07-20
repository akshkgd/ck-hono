import { db } from '../../../db/index.js';
import { EnrollmentRepository, type NewEnrollment } from '../../enrollments/enrollment.repository.js';
import { UserRepository } from '../../users/user.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import { PaymentRepository } from '../../payments/payment.repository.js';
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
  EnrollmentSearchQueryInput
} from '../../enrollments/enrollment.validation.js';
import { queueEnrollmentEmail, queuePaymentSuccessEmail } from '../../../queues/index.js';

function sanitizeString(val: string | null | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
    return null;
  }
  return trimmed;
}

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
    // 1. Verify User and Batch Exist in parallel
    const [user, batch] = await Promise.all([
      this.userRepository.findById(input.userId),
      this.batchRepository.findById(input.batchId),
    ]);

    if (!user) {
      throw new Error('User not found');
    }
    if (!batch) {
      throw new Error('Batch not found');
    }

    const transactionId = sanitizeString(input.transactionId);
    const invoiceId = sanitizeString(input.invoiceId);
    const certificateId = sanitizeString(input.certificateId);
    const paymentMethod = sanitizeString(input.paymentMethod);
    const couponCode = sanitizeString(input.couponCode);
    const remark = sanitizeString(input.remark);

    // 3. Verify Certificate ID Uniqueness
    if (certificateId) {
      const existingCert = await this.enrollmentRepository.findByCertificateId(certificateId);
      if (existingCert) {
        throw new Error('Certificate ID already in use');
      }
    }

    // 4. Run all write operations inside a transaction to prevent partial database states
    const createdEnrollmentResult = await db.transaction(async (tx) => {
      const newEnrollment = await this.enrollmentRepository.create({
        ...input,
        transactionId,
        invoiceId,
        certificateId,
        paymentMethod,
        couponCode,
        remark,
        amountPaid: input.amountPaid ?? 0,
        paidAt: input.paidAt ? new Date(input.paidAt) : null,
        certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : null,
        startedAt: input.startedAt ? new Date(input.startedAt) : null,
      }, tx);

      // Automatically create a matching transaction in batch_enrollment_payments if amountPaid > 0
      if (newEnrollment.amountPaid > 0) {
        let paymentExists = false;
        if (transactionId) {
          const existingPayment = await this.paymentRepository.findByTransactionId(transactionId, tx);
          if (existingPayment) {
            paymentExists = true;
          }
        }

        if (!paymentExists) {
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
          }, tx);
        }

        // Recalculate to ensure everything, including status, is perfectly in sync
        await this.enrollmentRepository.recalculateAmountPaid(newEnrollment.id, tx);
        
        // Fetch the updated enrollment to return it with the updated state
        const updatedEnrollment = await this.enrollmentRepository.findById(newEnrollment.id, tx);
        if (updatedEnrollment) {
          return updatedEnrollment;
        }
      }

      return newEnrollment;
    });

    // Queue background notification emails for the student (unless explicitly disabled)
    try {
      if (input.notifyUser !== false && user && batch && user.email) {
        const studentName = user.name || user.email.split('@')[0];
        const courseName = batch.name || 'Cohort Batch';

        // 1. Enrollment Welcome Email
        await queueEnrollmentEmail(user.email, {
          studentName,
          courseName,
          startDate: batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'Immediate Access',
          whatsappLink: batch.whatsAppLink || undefined,
          telegramLink: batch.telegramLink || undefined,
          meetingLink: batch.meetingLink || undefined,
          dashboardUrl: process.env.FRONTEND_URL || 'https://codingkampus.com/dashboard',
        });

        // 2. Optional Payment Receipt Email if amount paid > 0
        if (createdEnrollmentResult.amountPaid && createdEnrollmentResult.amountPaid > 0) {
          await queuePaymentSuccessEmail(user.email, {
            studentName,
            itemName: courseName,
            amountPaid: createdEnrollmentResult.amountPaid,
            currency: 'INR',
            transactionId: createdEnrollmentResult.transactionId || `tx-${createdEnrollmentResult.id}`,
            invoiceId: createdEnrollmentResult.invoiceId || `inv-${createdEnrollmentResult.id}`,
            dashboardUrl: process.env.FRONTEND_URL || 'https://codingkampus.com/dashboard',
          });
        }
      }
    } catch (emailErr: any) {
      console.error('[Admin Enrollment] Failed to queue email notifications:', emailErr);
    }

    return createdEnrollmentResult;
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
    const calculatedDaysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysPassed = enrollment.overrideAccessDays !== null && enrollment.overrideAccessDays !== undefined && enrollment.overrideAccessDays > 0
      ? Math.max(calculatedDaysPassed, enrollment.overrideAccessDays)
      : calculatedDaysPassed;

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

    const transactionId = input.transactionId !== undefined ? sanitizeString(input.transactionId) : undefined;
    const invoiceId = input.invoiceId !== undefined ? sanitizeString(input.invoiceId) : undefined;
    const certificateId = input.certificateId !== undefined ? sanitizeString(input.certificateId) : undefined;
    const paymentMethod = input.paymentMethod !== undefined ? sanitizeString(input.paymentMethod) : undefined;
    const couponCode = input.couponCode !== undefined ? sanitizeString(input.couponCode) : undefined;
    const remark = input.remark !== undefined ? sanitizeString(input.remark) : undefined;

    if (certificateId && certificateId !== enrollment.certificateId) {
      const existingCert = await this.enrollmentRepository.findByCertificateId(certificateId);
      if (existingCert) {
        throw new Error('Certificate ID already in use');
      }
    }

    return await db.transaction(async (tx) => {
      const updated = await this.enrollmentRepository.update(id, {
        ...input,
        transactionId,
        invoiceId,
        certificateId,
        paymentMethod,
        couponCode,
        remark,
        amountPaid: input.amountPaid ?? undefined,
        paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
        certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : undefined,
        startedAt: input.startedAt ? new Date(input.startedAt) : undefined,
      }, tx);

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
            paymentMethod: paymentMethod || enrollment.paymentMethod || 'Manual',
            transactionId: transactionId || `tx-update-${id}-${Date.now()}`,
            invoiceId: invoiceId || `inv-update-${id}-${Date.now()}`,
            purpose: diff > 0 ? 'enrollment' : 'refund',
            isGstApplicable: true,
            remarks: remark || `Logged automatically on enrollment update (amountPaid changed from ${enrollment.amountPaid} to ${input.amountPaid})`,
          }, tx);
          
          // Recalculate enrollment total & status
          await this.enrollmentRepository.recalculateAmountPaid(id, tx);
          
          // Return refreshed enrollment
          const refreshed = await this.enrollmentRepository.findById(id, tx);
          if (refreshed) {
            return refreshed;
          }
        }
      }

      return updated;
    });
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
