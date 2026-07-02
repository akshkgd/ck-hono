import { UserRepository } from '../users/user.repository.js';
import { EnrollmentRepository } from '../enrollments/enrollment.repository.js';
import { ContentLibraryRepository } from '../content-library/content-library.repository.js';

export class ReportsService {
  private userRepository: UserRepository;
  private enrollmentRepository: EnrollmentRepository;
  private contentLibraryRepository: ContentLibraryRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.contentLibraryRepository = new ContentLibraryRepository();
  }

  public async getSummary() {
    const [totalUsers, totalCoursesEnrolled, totalContentLibraryItems] = await Promise.all([
      this.userRepository.count(),
      this.enrollmentRepository.count('', undefined, undefined, 'captured'),
      this.contentLibraryRepository.count('')
    ]);

    return {
      totalUsers,
      totalCoursesEnrolled,
      totalContentLibraryItems
    };
  }
}
