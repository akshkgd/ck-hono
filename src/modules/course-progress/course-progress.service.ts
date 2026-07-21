import { CourseProgressRepository } from './course-progress.repository.js';
import { EnrollmentRepository } from '../enrollments/enrollment.repository.js';
import { BatchContentRepository } from '../batch-content/batch-content.repository.js';
import type { UpsertProgressInput } from './course-progress.validation.js';

export class CourseProgressService {
  private courseProgressRepository: CourseProgressRepository;
  private enrollmentRepository: EnrollmentRepository;
  private batchContentRepository: BatchContentRepository;

  constructor() {
    this.courseProgressRepository = new CourseProgressRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.batchContentRepository = new BatchContentRepository();
  }

  public async updateProgress(userId: string, input: UpsertProgressInput) {
    // 1. Verify Batch Content exists
    const contentLink = await this.batchContentRepository.findById(input.batchContentId);
    if (!contentLink) {
      throw new Error('Batch content linkage not found');
    }

    // 2. Verify User Enrollment exists for this batch
    const enrollment = await this.enrollmentRepository.findByUserAndBatch(userId, contentLink.batchId);
    if (!enrollment) {
      throw new Error('User is not enrolled in the batch associated with this content');
    }

    // 3. Upsert detailed progress
    const progressRecord = await this.courseProgressRepository.upsertProgress({
      userId,
      enrollmentId: enrollment.id,
      batchContentId: input.batchContentId,
      timeSpent: input.timeSpent,
      progress: input.progress,
      status: input.status,
    });

    // 4. Recalculate and update total progress on the parent enrollment
    const totalContentCount = await this.batchContentRepository.count(contentLink.batchId);
    if (totalContentCount > 0) {
      const aggregates = await this.courseProgressRepository.getAggregateProgressForEnrollment(enrollment.id);
      
      const overallProgress = Math.min(100, Math.round(aggregates.totalProgressSum / totalContentCount));
      const overallTimeSpent = aggregates.totalTimeSpent;

      await this.enrollmentRepository.update(enrollment.id, {
        progress: overallProgress,
        timeSpentSeconds: overallTimeSpent,
      });
    }

    return progressRecord;
  }

  public async getBatchProgress(userId: string, batchId: string) {
    // 1. Verify enrollment exists
    const enrollment = await this.enrollmentRepository.findByUserAndBatch(userId, batchId);
    if (!enrollment) {
      throw new Error('User is not enrolled in this batch');
    }

    // 2. Fetch all content mappings for this batch (up to 500 items max)
    const contentList = await this.batchContentRepository.search(500, 0, batchId);

    // 3. Fetch all progress logs for this enrollment
    const progressList = await this.courseProgressRepository.getProgressForEnrollment(enrollment.id);

    // Create lookup map
    const progressMap = new Map(progressList.map(p => [p.batchContentId, p]));

    // 4. Map together
    const items = contentList.map(item => {
      const progressEntry = progressMap.get(item.id);
      return {
        ...item,
        userProgress: {
          timeSpent: progressEntry?.timeSpent ?? 0,
          progress: progressEntry?.progress ?? 0,
          status: progressEntry?.status ?? 'not_started',
          updatedAt: progressEntry?.updatedAt ?? null,
        }
      };
    });

    return {
      enrollmentId: enrollment.id,
      batchId,
      progress: enrollment.progress,
      timeSpentSeconds: enrollment.timeSpentSeconds,
      items,
    };
  }
}
