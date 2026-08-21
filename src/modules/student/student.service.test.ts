import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StudentService } from './student.service.js';
import { TARGET_BUNNY_PULL_ZONE_HOST } from '../../utils/bunny-token.util.js';

describe('StudentService - Bunny CDN Signed URL & VideoLink Omission', () => {
  let studentService: StudentService;

  beforeEach(() => {
    studentService = new StudentService();
    process.env.BUNNY_CDN_TOKEN_KEY = 'test-token-key';
  });

  describe('checkContentAccess', () => {
    it('should attach signedUrl and expiresAt when access is allowed for target Bunny CDN video', async () => {
      const mockDetails = {
        batchContentId: 1,
        batchId: 10,
        accessOn: 0,
        accessTill: 0,
        accessOnDate: null,
        accessTillDate: null,
        canSubmitAssignment: false,
        videoDuration: 120,
        type: 'video',
        videoLink: `https://${TARGET_BUNNY_PULL_ZONE_HOST}/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8`,
        xp: 10,
        assignmentStatus: null,
        enrollment: {
          id: 100,
          paymentStatus: 'captured',
          startedAt: new Date(),
          paidAt: new Date(),
          accessTill: null,
          overrideAccessDays: null,
          createdAt: new Date(),
          courseStartDate: new Date(),
          sequentialLearning: false,
          sequentialLearningWithAssignments: false,
        },
      };

      vi.spyOn((studentService as any).studentRepository, 'getBatchContentAccessDetails').mockResolvedValue(mockDetails);

      const result = await studentService.checkContentAccess('user-1', '1');

      expect(result.allowed).toBe(true);
      expect(result.signedUrl).toBeDefined();
      expect(result.signedUrl).toContain(`https://${TARGET_BUNNY_PULL_ZONE_HOST}/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8?token=`);
      expect(result.signedUrl).toContain('&expires=');
      expect(result.signedUrl).toContain('token_path=%2F5a8e9321-abcd-1234-efgh-567890123456%2F');
      expect(result.signedUrl).toContain('/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8');
      expect(result.expiresAt).toBeDefined();
    });

    it('should return raw videoLink as signedUrl for videos on other stream IDs without token auth', async () => {
      const mockDetails = {
        batchContentId: 2,
        batchId: 10,
        accessOn: 0,
        accessTill: 0,
        accessOnDate: null,
        accessTillDate: null,
        canSubmitAssignment: false,
        videoDuration: 120,
        type: 'video',
        videoLink: 'https://vz-other-library.b-cdn.net/12345/playlist.m3u8',
        xp: 10,
        assignmentStatus: null,
        enrollment: {
          id: 100,
          paymentStatus: 'captured',
          startedAt: new Date(),
          paidAt: new Date(),
          accessTill: null,
          overrideAccessDays: null,
          createdAt: new Date(),
          courseStartDate: new Date(),
          sequentialLearning: false,
          sequentialLearningWithAssignments: false,
        },
      };

      vi.spyOn((studentService as any).studentRepository, 'getBatchContentAccessDetails').mockResolvedValue(mockDetails);

      const result = await studentService.checkContentAccess('user-1', '2');

      expect(result.allowed).toBe(true);
      expect(result.signedUrl).toBe('https://vz-other-library.b-cdn.net/12345/playlist.m3u8');
      expect(result.videoLink).toBe('https://vz-other-library.b-cdn.net/12345/playlist.m3u8');
      expect(result.expiresAt).toBeUndefined();
    });
  });

  describe('getCourseDetails', () => {
    it('should set videoLink to null for content items in getCourseDetails response', async () => {
      const mockEnrollment = {
        id: 100,
        batchId: 10,
        paymentStatus: 'captured',
        startedAt: new Date(),
        paidAt: new Date(),
        accessTill: null,
        overrideAccessDays: null,
        createdAt: new Date(),
        batchType: 'recorded',
      };

      const mockSections = [
        { id: 1, batchId: 10, title: 'Module 1', order: 1 }
      ];

      const mockContents = [
        {
          id: 1,
          contentId: 5,
          sectionId: 1,
          order: 1,
          accessOn: 0,
          accessTill: 0,
          accessOnDate: null,
          accessTillDate: null,
          canSubmitAssignment: false,
          content: {
            id: 5,
            title: 'Intro Video',
            desc: 'Description',
            type: 'video',
            contentType: 'video/mp4',
            videoLink: `https://${TARGET_BUNNY_PULL_ZONE_HOST}/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8`,
            videoDuration: 300,
            xp: 100,
            assignment: null,
            solutionCode: null,
            hints: null,
          },
          progress: null,
        }
      ];

      vi.spyOn((studentService as any).studentRepository, 'findEnrollment').mockResolvedValue(mockEnrollment);
      vi.spyOn((studentService as any).studentRepository, 'getBatchSections').mockResolvedValue(mockSections);
      vi.spyOn((studentService as any).studentRepository, 'getBatchContentWithProgress').mockResolvedValue(mockContents);

      const details = await studentService.getCourseDetails('user-1', '10');

      expect(details.sections).toHaveLength(1);
      expect(details.sections[0].contents).toHaveLength(1);

      const contentItem = details.sections[0].contents[0];
      expect(contentItem.content.videoLink).toBeNull();
    });
  });
});
