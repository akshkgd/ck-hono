import { p, SAMPLE, type Param } from '../kit.js';

export const pageParam = p('page', 'integer ≥ 1', 'default 1', 'Page number.');
export const limitParam = (max: number, def: number) => p('limit', `integer 1–${max}`, `default ${def}`, 'Page size.');
export const qParam = (what: string) => p('q', 'string', 'default ""', `Free-text search over ${what}.`);

export const timeRangeParams = (def: string | null): Param[] => [
  p(
    'timeRange',
    "'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'custom'",
    def ? `default '${def}'` : 'optional',
    'Preset date window. `custom` needs both `startDate` and `endDate`.'
  ),
  p('startDate', 'YYYY-MM-DD', "required when timeRange = 'custom'", 'Start of the custom window.'),
  p('endDate', 'YYYY-MM-DD', "required when timeRange = 'custom'", 'End of the custom window.'),
];

export const idParam = (name: string, what: string) => p(name, 'uuid', 'required', what);

export const userRow = {
  id: SAMPLE.uuid,
  email: 'asha@example.com',
  name: 'Asha Verma',
  mobile: '+919876543210',
  avatarUrl: null,
  bio: null,
  linkedinUrl: null,
  githubUrl: null,
  occupationType: 'student',
  occupationTitle: null,
  organization: null,
  experienceYears: null,
  role: 'student',
  status: 'active',
  googleId: null,
  emailVerified: true,
  xp: 120,
  currentStreak: 3,
  longestStreak: 9,
  metadata: {},
  lastActiveAt: SAMPLE.iso,
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const batchRow = {
  id: SAMPLE.uuid,
  topic: 'Web development',
  name: 'Full-Stack Cohort',
  description: 'Six months, live classes',
  slug: 'full-stack-cohort',
  price: 14999,
  renewalFee: 4999,
  certificateFee: 0,
  limit: 0,
  img: null,
  association: null,
  logo: null,
  type: 'cohort',
  startDate: '2026-11-01',
  endDate: '2027-05-01',
  whatsAppLink: null,
  telegramLink: null,
  telegramBroadcast: null,
  teacherId: null,
  teacherPayment: false,
  meetingLink: null,
  nextClassTopic: null,
  desc: null,
  nextClass: null,
  status: 'active',
  metadata: {},
  accessTillDate: null,
  accessTillYear: 1,
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const enrollmentRow = {
  id: SAMPLE.uuid,
  userId: SAMPLE.uuid2,
  batchId: SAMPLE.uuid3,
  amountPayable: 14999,
  enrollmentType: 'oneTime',
  status: 1,
  progress: 42,
  timeSpentSeconds: 18300,
  amountPaid: 14999,
  certificateFee: null,
  paymentStatus: 'captured',
  paymentMethod: 'upi',
  couponCode: null,
  transactionId: 'pay_Nk3x9d2LqP0aZ1',
  invoiceId: null,
  subscriptionId: null,
  subscriptionStatus: null,
  subscriptionActiveOn: null,
  subscriptionExpiresOn: null,
  paidAt: SAMPLE.iso,
  certificateId: null,
  certificateGeneratedAt: null,
  startedAt: SAMPLE.iso,
  accessTill: '2027-11-12',
  overrideAccessDays: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  remark: null,
  sequentialLearning: false,
  sequentialLearningWithAssignments: false,
  metadata: {},
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const paymentRow = {
  id: SAMPLE.uuid,
  batchEnrollmentId: SAMPLE.uuid2,
  amount: 14999,
  paidAt: SAMPLE.iso,
  paymentMethod: 'upi',
  transactionId: 'pay_Nk3x9d2LqP0aZ1',
  invoiceId: 'inv-rp-pay_Nk3x9d2LqP0aZ1',
  purpose: 'enrollment',
  isGstApplicable: true,
  remarks: null,
  metadata: {},
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const sectionRow = {
  id: SAMPLE.uuid,
  title: 'Getting started',
  batchId: SAMPLE.uuid2,
  order: 1,
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const contentRow = {
  id: SAMPLE.uuid,
  title: 'Intro to HTML',
  desc: null,
  type: 'video',
  contentType: 'primary',
  videoLink: 'https://vz-xxxx.b-cdn.net/abc/playlist.m3u8',
  videoDuration: 612,
  assignment: null,
  xp: 10,
  solutionCode: null,
  hints: null,
  metadata: {},
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const batchContentRow = {
  id: SAMPLE.uuid,
  batchId: SAMPLE.uuid2,
  contentId: SAMPLE.uuid3,
  sectionId: SAMPLE.uuid2,
  order: 1,
  accessOn: 0,
  accessTill: 0,
  accessOnDate: null,
  accessTillDate: null,
  canSubmitAssignment: true,
  metadata: {},
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const liveSessionRow = {
  id: SAMPLE.uuid,
  batchId: SAMPLE.uuid2,
  sectionId: null,
  topic: 'Week 3: APIs',
  desc: null,
  time: SAMPLE.iso,
  screenHlsVideo: null,
  faceHlsVideo: null,
  recordingHls: null,
  order: 0,
  dummyCount: null,
  createdAt: SAMPLE.iso,
  updatedAt: SAMPLE.iso,
};

export const reorderBody = [p('orders', 'Array<{ id: string; order: integer }>', 'required', 'New position for each id.')];
export const reorderExample = { orders: [{ id: SAMPLE.uuid, order: 1 }, { id: SAMPLE.uuid2, order: 2 }] };
