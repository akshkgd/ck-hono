import type { Page } from '../kit.js';
import { auth, errors, gettingStarted, home } from './getting-started.js';
import { health, publicApi } from './public.js';
import { courseProgressLegacy, studentAccount, studentCourses } from './student.js';
import { razorpay } from './payments.js';
import {
  adminBatchContent,
  adminBatches,
  adminContentLibrary,
  adminEnrollments,
  adminPayments,
  adminSections,
  adminUsers,
} from './admin-core.js';
import {
  adminAnalytics,
  adminAssignments,
  adminBugs,
  adminCourseProgress,
  adminLiveSessions,
  adminWatchlist,
} from './admin-learning.js';
import { adminEmail, adminLogs, adminMigrations, adminQueues, adminTerminal } from './ops.js';
import { accessControl, architecture, database, environment } from './reference.js';

/** Every docs page. Order within a group is the order shown in the sidebar. */
export const PAGES: Page[] = [
  home,
  gettingStarted,
  auth,
  errors,
  publicApi,
  health,
  studentCourses,
  studentAccount,
  courseProgressLegacy,
  razorpay,
  adminUsers,
  adminBatches,
  adminSections,
  adminContentLibrary,
  adminBatchContent,
  adminEnrollments,
  adminPayments,
  adminLiveSessions,
  adminAssignments,
  adminCourseProgress,
  adminAnalytics,
  adminWatchlist,
  adminBugs,
  adminEmail,
  adminQueues,
  adminMigrations,
  adminLogs,
  adminTerminal,
  accessControl,
  architecture,
  database,
  environment,
];

// Group assignment for pages defined with a different default group.
const GROUP_OVERRIDES: Record<string, string> = {
  'payments/razorpay': 'Payments',
};
for (const page of PAGES) {
  const g = GROUP_OVERRIDES[page.path];
  if (g) page.group = g;
}
