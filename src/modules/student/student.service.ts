import { StudentRepository } from './student.repository.js';
import type { StudentProgressInput, StudentAssignmentInput } from './student.validation.js';

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

    // Determine start date: startedAt || paidAt || createdAt
    const startDate = enrollment.startedAt 
      ? new Date(enrollment.startedAt) 
      : (enrollment.paidAt ? new Date(enrollment.paidAt) : new Date(enrollment.createdAt));

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
    const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

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
        content: item.content,
        progress: {
          status: progressStatus,
          timeSpent: item.progress?.timeSpent || 0,
          progress: item.progress?.progress || 0,
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

    // Determine start date: startedAt || paidAt || createdAt
    const startDate = enrollment.startedAt 
      ? new Date(enrollment.startedAt) 
      : (enrollment.paidAt ? new Date(enrollment.paidAt) : new Date(enrollment.createdAt));

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
    const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

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

    // 2. Perform atomic upsert for specific batchContent progress (Query 1)
    const progressRecord = await this.studentRepository.upsertContentProgress(
      userId,
      enrollment.id,
      input.batchContentId,
      input.timeSpent,
      input.progress,
      input.status
    );

    // 3. Count all contents in the batch
    const totalContentCount = await this.studentRepository.countBatchContents(details.batchId);

    // 4. Atomic aggregate update to enrollment records (Query 2)
    if (totalContentCount > 0) {
      await this.studentRepository.updateEnrollmentAggregates(
        enrollment.id,
        input.timeSpent,
        totalContentCount
      );
    }

    return progressRecord;
  }

  public async submitAssignment(userId: string, batchContentId: number, input: StudentAssignmentInput) {
    // 1. Verify content and active captured enrollment
    const details = await this.studentRepository.getBatchContentAccessDetails(batchContentId, userId);
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

    // 2. Perform atomic assignment submission (Query 1)
    const progressRecord = await this.studentRepository.upsertAssignmentSubmission(
      userId,
      enrollment.id,
      batchContentId,
      input
    );

    // 3. Count all contents in the batch
    const totalContentCount = await this.studentRepository.countBatchContents(details.batchId);

    // 4. Update aggregates (Query 2) - Note: assignment submission adds 0 delta to timeSpent, but updates completion progress
    if (totalContentCount > 0) {
      await this.studentRepository.updateEnrollmentAggregates(
        enrollment.id,
        0,
        totalContentCount
      );
    }

    return progressRecord;
  }
}
