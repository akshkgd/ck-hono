import { StudentRepository } from './student.repository.js';
import type { StudentProgressInput, StudentAssignmentInput, UpdateProfileInput } from './student.validation.js';

export class StudentService {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  public async getEnrolledCourses(userId: string) {
    const courses = await this.studentRepository.findEnrolledCourses(userId);
    return courses.map(course => {
      const payable = course.amountPayable || 0;
      const paid = course.amountPaid || 0;
      const remaining = Math.max(0, payable - paid);
      return {
        ...course,
        amountPayable: payable,
        amountPaid: paid,
        amountRemaining: remaining
      };
    });
  }

  public async getCourseDetails(userId: string, batchId: number) {
    const enrollment = await this.studentRepository.findEnrollment(userId, batchId);
    if (!enrollment) {
      throw new Error('Enrollment not found for this course');
    }
    if (enrollment.paymentStatus !== 'captured') {
      throw new Error('Access denied: Course requires a captured enrollment payment');
    }

    const startedAtDate = enrollment.startedAt ? new Date(enrollment.startedAt) : null;
    const paidAtDate = enrollment.paidAt ? new Date(enrollment.paidAt) : null;
    const startDate = startedAtDate || paidAtDate || enrollment.createdAt;

    // Determine end date: accessTill || (startDate + 1 year)
    let endDate: Date;
    if (enrollment.accessTill) {
      endDate = new Date(enrollment.accessTill);
    } else {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Calculate days passed from start date to today
    const now = new Date();
    const diffTime = now.getTime() - startDate.getTime();
    const calculatedDaysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysPassed = enrollment.overrideAccessDays !== null && enrollment.overrideAccessDays !== undefined && enrollment.overrideAccessDays > 0
      ? Math.max(calculatedDaysPassed, enrollment.overrideAccessDays)
      : calculatedDaysPassed;

    // Check if access is active: today is less than or equal to accessTill date
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDateMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const isAccessActive = todayMidnight.getTime() <= endDateMidnight.getTime();

    // Fetch sections and content in parallel
    const [sections, contents] = await Promise.all([
      this.studentRepository.getBatchSections(batchId),
      this.studentRepository.getBatchContentWithProgress(batchId, userId, enrollment.id),
    ]);

    // Map content items to their corresponding sections
    const sectionsMap = new Map<number, any[]>();
    for (const section of sections) {
      sectionsMap.set(section.id, []);
    }

    const unassignedContents: any[] = [];
    let lastVideoItem: any = null;

    for (const item of contents) {
      const progressStatus = item.progress?.status || 'not_started';

      let isSequentiallyLocked = false;
      if (enrollment.sequentialLearning || enrollment.sequentialLearningWithAssignments) {
        if (lastVideoItem) {
          const isPrevVideoCompleted = lastVideoItem.progress?.status === 'completed';
          let isPrevVideoAssignmentSatisfied = true;
          if (enrollment.sequentialLearningWithAssignments && lastVideoItem.canSubmitAssignment) {
            const assignmentStatus = lastVideoItem.progress?.assignmentStatus;
            isPrevVideoAssignmentSatisfied = assignmentStatus !== null && assignmentStatus !== undefined && assignmentStatus !== 'pending';
          }
          if (!isPrevVideoCompleted || !isPrevVideoAssignmentSatisfied) {
            isSequentiallyLocked = true;
          }
        }
      }

      if (item.content.type === 'video') {
        lastVideoItem = item;
      }

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
        isSequentiallyLocked,
        content: item.content,
        progress: {
          status: progressStatus,
          timeSpent: item.progress?.timeSpent || 0,
          progress: item.progress?.progress || 0,
          lastWatchedPosition: item.progress?.lastWatchedPosition || 0,
          githubLink: item.progress?.githubLink || null,
          deployedLink: item.progress?.deployedLink || null,
          DeployedLink: item.progress?.deployedLink || null,
          assignmentStatus: item.progress?.assignmentStatus || null,
          teacherRemark: item.progress?.teacherRemark || null,
          videoFeedback: item.progress?.videoFeedback || null,
        }
      };

      const sId = item.sectionId ? Number(item.sectionId) : null;
      if (sId !== null && sectionsMap.has(sId)) {
        sectionsMap.get(sId)!.push(itemMapped);
      } else {
        unassignedContents.push(itemMapped);
      }
    }

    const sectionsWithContents = sections.map(section => ({
      ...section,
      contents: sectionsMap.get(section.id) || [],
    }));

    return {
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progress: enrollment.progress,
        timeSpentSeconds: enrollment.timeSpentSeconds,
        paymentStatus: enrollment.paymentStatus,
        startedAt: enrollment.startedAt || enrollment.paidAt || enrollment.createdAt,
        accessTill: enrollment.accessTill || endDate,
        daysPassed,
        isAccessActive,
        amountPayable: enrollment.amountPayable || 0,
        amountPaid: enrollment.amountPaid || 0,
        amountRemaining: Math.max(0, (enrollment.amountPayable || 0) - (enrollment.amountPaid || 0)),
        sequentialLearning: enrollment.sequentialLearning || false,
        sequentialLearningWithAssignments: enrollment.sequentialLearningWithAssignments || false,
      },
      sections: sectionsWithContents,
      ...(unassignedContents.length > 0 ? { unassignedContents } : {}),
    };
  }

  public async checkContentAccess(userId: string, batchContentId: number) {
    const details = await this.studentRepository.getBatchContentAccessDetails(batchContentId, userId);
    if (!details) {
      throw new Error('Batch content not found');
    }

    const enrollment = details.enrollment;
    if (!enrollment) {
      throw new Error('Access denied: You are not enrolled in this course');
    }

    if (enrollment.paymentStatus !== 'captured') {
      throw new Error('Access denied: Course requires a captured enrollment payment');
    }

    const startedAtDate = enrollment.startedAt ? new Date(enrollment.startedAt) : null;
    const paidAtDate = enrollment.paidAt ? new Date(enrollment.paidAt) : null;
    const startDate = startedAtDate || paidAtDate || (enrollment.createdAt ? new Date(enrollment.createdAt) : new Date());

    // Determine access limit date: accessTill || (startDate + 1 year)
    let endDate: Date;
    if (enrollment.accessTill) {
      endDate = new Date(enrollment.accessTill);
    } else {
      endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDateMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // 1. Overall enrollment expiration check
    if (todayMidnight.getTime() > endDateMidnight.getTime()) {
      return { allowed: false, reason: 'Course access has expired' };
    }

    const diffTime = now.getTime() - startDate.getTime();
    const calculatedDaysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysPassed = enrollment.overrideAccessDays !== null && enrollment.overrideAccessDays !== undefined && enrollment.overrideAccessDays > 0
      ? Math.max(calculatedDaysPassed, enrollment.overrideAccessDays)
      : calculatedDaysPassed;

    // 2. Relative unlock day check (accessOn)
    if (daysPassed < details.accessOn) {
      return { allowed: false, reason: `Content unlocks in ${details.accessOn - daysPassed} days` };
    }

    // 3. Relative expiry day check (accessTill)
    if (details.accessTill > 0 && daysPassed > details.accessTill) {
      return { allowed: false, reason: 'Content access period has closed' };
    }

    // 4. Calendar date unlock check (accessOnDate)
    if (details.accessOnDate) {
      const accessOnDateObj = new Date(details.accessOnDate);
      const accessOnMidnight = new Date(accessOnDateObj.getFullYear(), accessOnDateObj.getMonth(), accessOnDateObj.getDate());
      if (todayMidnight.getTime() < accessOnMidnight.getTime()) {
        return { allowed: false, reason: `Content unlocks on ${details.accessOnDate}` };
      }
    }

    // 5. Calendar date expiry check (accessTillDate)
    if (details.accessTillDate) {
      const accessTillDateObj = new Date(details.accessTillDate);
      const accessTillMidnight = new Date(accessTillDateObj.getFullYear(), accessTillDateObj.getMonth(), accessTillDateObj.getDate());
      if (todayMidnight.getTime() > accessTillMidnight.getTime()) {
        return { allowed: false, reason: 'Content access date has passed' };
      }
    }

    // 6. Sequential Learning Checks
    if (enrollment.sequentialLearning || enrollment.sequentialLearningWithAssignments) {
      const contents = await this.studentRepository.getBatchContentWithProgress(details.batchId, userId, enrollment.id!);
      
      let lastVideoItem: any = null;
      for (const item of contents) {
        if (item.id === batchContentId) {
          if (lastVideoItem) {
            const isPrevVideoCompleted = lastVideoItem.progress?.status === 'completed';
            let isPrevVideoAssignmentSatisfied = true;
            if (enrollment.sequentialLearningWithAssignments && lastVideoItem.canSubmitAssignment) {
              const assignmentStatus = lastVideoItem.progress?.assignmentStatus;
              isPrevVideoAssignmentSatisfied = assignmentStatus !== null && assignmentStatus !== undefined && assignmentStatus !== 'pending';
            }
            if (!isPrevVideoCompleted || !isPrevVideoAssignmentSatisfied) {
              return {
                allowed: false,
                reason: enrollment.sequentialLearningWithAssignments
                  ? 'Access denied: Complete the previous video and submit its assignment to unlock this content'
                  : 'Access denied: Complete the previous video to unlock this content'
              };
            }
          }
          break;
        }

        if (item.content.type === 'video') {
          lastVideoItem = item;
        }
      }
    }

    return { allowed: true };
  }

  public async updateStudentProgress(userId: string, input: StudentProgressInput) {
    // 1. Verify content and active captured enrollment
    const details = await this.studentRepository.getBatchContentAccessDetails(input.batchContentId, userId);
    if (!details) {
      throw new Error('Batch content not found');
    }

    const enrollment = details.enrollment;
    if (!enrollment) {
      throw new Error('Access denied: You are not enrolled in the course associated with this content');
    }

    if (enrollment.paymentStatus !== 'captured') {
      throw new Error('Access denied: Course requires a captured enrollment payment');
    }

    const access = await this.checkContentAccess(userId, input.batchContentId);
    if (!access.allowed) {
      throw new Error(`Access denied: ${access.reason}`);
    }

    const enrollmentId = enrollment.id!;

    // 2. Perform atomic upsert for specific batchContent progress (Query 1)
    const progressRecord = await this.studentRepository.upsertContentProgress(
      userId,
      enrollmentId,
      input.batchContentId,
      input.timeSpent,
      input.progress,
      input.status,
      details.videoDuration,
      details.canSubmitAssignment,
      input.lastWatchedPosition
    );

    // 3. Count all contents in the batch
    const totalContentCount = await this.studentRepository.countBatchContents(details.batchId);

    // 4. Atomic aggregate update to enrollment records (Query 2)
    if (totalContentCount > 0) {
      await this.studentRepository.updateEnrollmentAggregates(
        enrollmentId,
        input.timeSpent,
        totalContentCount
      );
    }

    if (!progressRecord) {
      return {
        id: 0,
        userId,
        enrollmentId,
        batchContentId: input.batchContentId,
        timeSpent: 0,
        progress: 0,
        status: 'not_started' as const,
        assignmentStatus: null,
        lastWatchedPosition: input.lastWatchedPosition || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return progressRecord;
  }

  public async submitAssignment(userId: string, batchContentId: number, input: StudentAssignmentInput) {
    // 1. Verify content and active captured enrollment
    const details = await this.studentRepository.getBatchContentAccessDetails(batchContentId, userId);
    if (!details) {
      throw new Error('Batch content not found');
    }

    if (details.canSubmitAssignment === false) {
      throw new Error('Access denied: Assignment submission is disabled for this content item');
    }

    if (details.assignmentStatus !== 'pending') {
      throw new Error('Access denied: You can only submit when assignment status is pending');
    }

    const enrollment = details.enrollment;
    if (!enrollment) {
      throw new Error('Access denied: You are not enrolled in the course associated with this content');
    }

    if (enrollment.paymentStatus !== 'captured') {
      throw new Error('Access denied: Course requires a captured enrollment payment');
    }

    const access = await this.checkContentAccess(userId, batchContentId);
    if (!access.allowed) {
      throw new Error(`Access denied: ${access.reason}`);
    }

    const enrollmentId = enrollment.id!;

    // 2. Perform atomic assignment submission (Query 1)
    const progressRecord = await this.studentRepository.upsertAssignmentSubmission(
      userId,
      enrollmentId,
      batchContentId,
      input
    );

    // 3. Count all contents in the batch
    const totalContentCount = await this.studentRepository.countBatchContents(details.batchId);

    // 4. Update aggregates (Query 2) - Note: assignment submission adds 0 delta to timeSpent, but updates completion progress
    if (totalContentCount > 0) {
      await this.studentRepository.updateEnrollmentAggregates(
        enrollmentId,
        0,
        totalContentCount
      );
    }

    return progressRecord;
  }

  public async getPaymentsHistory(userId: string) {
    return this.studentRepository.getStudentPayments(userId);
  }

  public async updateProfile(userId: string, input: UpdateProfileInput) {
    const updatedUser = await this.studentRepository.updateUserProfile(userId, input);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
