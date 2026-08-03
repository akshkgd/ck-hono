import { db } from '../../../db/index.js';
import { AdminCourseProgressRepository } from './admin-course-progress.repository.js';
import type { ProgressQueryInput, BulkUpdateProgressInput } from './admin-course-progress.validation.js';
import { calculateDateRange } from '../../../utils/date-range.js';
import { EnrollmentRepository } from '../../enrollments/enrollment.repository.js';
import { BatchContentRepository } from '../../batch-content/batch-content.repository.js';

function sanitizeString(val: string | null | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
    return null;
  }
  return trimmed;
}

export class AdminCourseProgressService {
  private repository: AdminCourseProgressRepository;
  private enrollmentRepository: EnrollmentRepository;
  private batchContentRepository: BatchContentRepository;

  constructor() {
    this.repository = new AdminCourseProgressRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.batchContentRepository = new BatchContentRepository();
  }

  public async getProgressReport(input: ProgressQueryInput) {
    const { from: start, to: end } = calculateDateRange(
      input.timeRange as any,
      input.startDate || undefined,
      input.endDate || undefined
    );

    const limit = input.limit;
    const offset = (input.page - 1) * limit;

    // Fetch progress list, totals, summary analytics, and daily breakdown in parallel
    const [logs, totalCount, analytics, chartData] = await Promise.all([
      this.repository.getProgressList(start, end, input.batchId || undefined, input.email || undefined, limit, offset, input.name || undefined),
      this.repository.countProgressTotal(start, end, input.batchId || undefined, input.email || undefined, input.name || undefined),
      this.repository.getProgressAnalytics(start, end, input.batchId || undefined, input.email || undefined, input.name || undefined),
      this.repository.getDailyProgressAnalytics(start, end, input.batchId || undefined, input.email || undefined, input.name || undefined),
    ]);

    // Calculate number of calendar days in the selected range to get a true daily average
    const oneDayMs = 24 * 60 * 60 * 1000;
    const diffDays = Math.max(1, Math.round(Math.abs((end.getTime() - start.getTime()) / oneDayMs)));
    const dailyAverageTimeSpentSeconds = Math.round(analytics.totalTimeSpent / diffDays);

    return {
      analytics: {
        totalUsers: analytics.totalUsers,
        totalTimeSpentSeconds: analytics.totalTimeSpent,
        dailyAverageTimeSpentSeconds,
        totalViews: analytics.totalViews,
      },
      chartData,
      progressLogs: logs,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: totalCount,
      }
    };
  }

  public async getEnrollmentBatchProgress(enrollmentId: string) {
    const enrollment = await this.repository.getEnrollmentDetails(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const { courseStartDate, batch, userId, ...enrollmentDetails } = enrollment;
    const now = new Date();
    const startDate = new Date(courseStartDate);
    const endDate = batch.endDate ? new Date(batch.endDate) : new Date();

    const diffTime = now.getTime() - startDate.getTime();
    const calculatedDaysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysPassed = enrollmentDetails.overrideAccessDays !== null && enrollmentDetails.overrideAccessDays !== undefined && enrollmentDetails.overrideAccessDays > 0
      ? Math.max(calculatedDaysPassed, enrollmentDetails.overrideAccessDays)
      : calculatedDaysPassed;

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDateMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const isAccessActive = todayMidnight.getTime() <= endDateMidnight.getTime();

    // Fetch sections and content in parallel
    const [sections, contents] = await Promise.all([
      this.repository.getBatchSections(batch.id),
      this.repository.getBatchContentWithProgress(batch.id, userId, enrollment.id),
    ]);

    // Map content items to their corresponding sections
    const sectionsMap = new Map<string, any[]>();
    for (const section of sections) {
      sectionsMap.set(String(section.id), []);
    }

    const unassignedContents: any[] = [];

    for (const item of contents) {
      const progressStatus = item.progress?.status || 'not_started';
      const itemMapped = {
        id: item.id,
        contentId: item.contentId,
        sectionId: item.sectionId,
        order: item.order,
        accessOn: item.accessOn,
        accessTill: item.accessTill,
        accessOnDate: item.accessOnDate,
        accessTillDate: item.accessTillDate,
        canSubmitAssignment: item.canSubmitAssignment,
        content: item.content,
        progress: {
          status: progressStatus,
          timeSpent: item.progress?.timeSpent || 0,
          progress: item.progress?.progress || 0,
          githubLink: item.progress?.githubLink || null,
          deployedLink: item.progress?.deployedLink || null,
          assignmentStatus: item.progress?.assignmentStatus || null,
          teacherRemark: item.progress?.teacherRemark || null,
          videoFeedback: item.progress?.videoFeedback || null,
        }
      };

      const sId = item.sectionId ? String(item.sectionId) : null;
      if (sId !== null && sectionsMap.has(sId)) {
        sectionsMap.get(sId)!.push(itemMapped);
      } else {
        unassignedContents.push(itemMapped);
      }
    }

    const sectionsWithContents = sections.map(section => ({
      ...section,
      contents: sectionsMap.get(String(section.id)) || [],
    }));

    return {
      batch,
      enrollment: {
        id: enrollmentDetails.id,
        status: enrollmentDetails.status,
        progress: enrollmentDetails.progress,
        timeSpentSeconds: enrollmentDetails.timeSpentSeconds,
        paymentStatus: enrollmentDetails.paymentStatus,
        startedAt: enrollmentDetails.startedAt || enrollmentDetails.paidAt || enrollmentDetails.createdAt,
        accessTill: enrollmentDetails.accessTill || endDate,
        daysPassed,
        isAccessActive,
        amountPayable: enrollmentDetails.amountPayable || 0,
        amountPaid: enrollmentDetails.amountPaid || 0,
        amountRemaining: Math.max(0, (enrollmentDetails.amountPayable || 0) - (enrollmentDetails.amountPaid || 0)),
      },
      sections: sectionsWithContents,
      ...(unassignedContents.length > 0 ? { unassignedContents } : {}),
    };
  }

  public async resetSubmittedAssignmentsToPending(batchId?: string) {
    return this.repository.resetSubmittedAssignmentsToPending(batchId);
  }

  public async bulkUpdateProgress(input: BulkUpdateProgressInput) {
    const { userId, batchId, items } = input;

    // 1. Verify Enrollment Exists
    const enrollment = await this.enrollmentRepository.findByUserAndBatch(userId, batchId);
    if (!enrollment) {
      throw new Error('User is not enrolled in the specified batch');
    }

    // 2. Perform bulk update and recalculation in a transaction
    return db.transaction(async (tx) => {
      // Fetch video durations for these batchContentIds
      const contentIds = items.map((i) => i.batchContentId);
      const durations = await this.repository.getBatchContentVideoDurations(contentIds, tx);
      const durationMap = new Map(durations.map((d) => [d.id, d.videoDuration || 0]));

      const valuesToUpsert = items.map((item) => {
        const durationInSeconds = durationMap.get(item.batchContentId) || 0;
        const timeSpentSeconds = item.watchMinutes * 60;
        
        // Auto-complete if checked OR watch time is at least 90% of duration
        const isCompleted = item.completed || (durationInSeconds > 0 && timeSpentSeconds >= durationInSeconds * 0.9);
        const progressPercent = isCompleted ? 100 : (durationInSeconds > 0 ? Math.min(100, Math.round((timeSpentSeconds * 100) / durationInSeconds)) : 0);
        const statusValue = isCompleted ? 'completed' : (timeSpentSeconds > 0 ? 'learning' : 'not_started');
        
        const github = sanitizeString(item.githubLink);
        const deployed = sanitizeString(item.deployedLink);
        const assignmentStatusValue = (github || deployed) ? 'submitted' : null;

        return {
          userId,
          enrollmentId: enrollment.id,
          batchContentId: item.batchContentId,
          timeSpent: timeSpentSeconds,
          progress: progressPercent,
          status: statusValue,
          githubLink: github,
          deployedLink: deployed,
          assignmentStatus: assignmentStatusValue,
          updatedAt: new Date(),
        };
      });

      // Execute bulk insert/update (upsert) in repository
      await this.repository.bulkUpsertProgress(valuesToUpsert, tx);

      // Recalculate aggregates on enrollment
      const totalContentCount = await this.batchContentRepository.count(batchId);
      if (totalContentCount > 0) {
        const aggregates = await this.repository.getAggregateProgressForEnrollment(enrollment.id, tx);
        const overallProgress = Math.min(100, Math.round(aggregates.totalProgressSum / totalContentCount));
        const overallTimeSpent = aggregates.totalTimeSpent;

        await this.enrollmentRepository.update(enrollment.id, {
          progress: overallProgress,
          timeSpentSeconds: overallTimeSpent,
        }, tx);
      }

      return {
        updatedCount: items.length,
      };
    });
  }
}
