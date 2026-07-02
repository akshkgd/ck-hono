import { EnrollmentRepository, type NewEnrollment } from '../../enrollments/enrollment.repository.js';
import { UserRepository } from '../../users/user.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import type {
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
  EnrollmentSearchQueryInput
} from '../../enrollments/enrollment.validation.js';

export class AdminEnrollmentsService {
  private enrollmentRepository: EnrollmentRepository;
  private userRepository: UserRepository;
  private batchRepository: BatchRepository;

  constructor() {
    this.enrollmentRepository = new EnrollmentRepository();
    this.userRepository = new UserRepository();
    this.batchRepository = new BatchRepository();
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
      paidAt: input.paidAt ? new Date(input.paidAt) : null,
      certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : null,
      startedAt: input.startedAt ? new Date(input.startedAt) : null,
    });

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
    return enrollment;
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
      paidAt: input.paidAt ? new Date(input.paidAt) : undefined,
      certificateGeneratedAt: input.certificateGeneratedAt ? new Date(input.certificateGeneratedAt) : undefined,
      startedAt: input.startedAt ? new Date(input.startedAt) : undefined,
    });

    if (!updated) {
      throw new Error('Failed to update enrollment');
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
