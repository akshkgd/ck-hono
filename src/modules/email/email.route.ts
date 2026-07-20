import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { emailController } from './email.controller.js';
import {
  sendEnrollmentEmailSchema,
  sendPaymentSuccessEmailSchema,
  sendAccessGrantedEmailSchema,
  sendGenericEmailSchema,
} from './email.validation.js';

export const emailRouter = new Hono();

// SMTP & Email Queue Health Check
emailRouter.get('/health', (c) => emailController.getHealth(c));

// Queue Audit Logs
emailRouter.get('/audit-logs', (c) => emailController.getAuditLogs(c));

// Trigger Enrollment Email
emailRouter.post(
  '/enrollment',
  zValidator('json', sendEnrollmentEmailSchema),
  (c) => emailController.sendEnrollmentEmail(c)
);

// Trigger Payment Success Email
emailRouter.post(
  '/payment-success',
  zValidator('json', sendPaymentSuccessEmailSchema),
  (c) => emailController.sendPaymentSuccessEmail(c)
);

// Trigger Access Granted Email
emailRouter.post(
  '/access-granted',
  zValidator('json', sendAccessGrantedEmailSchema),
  (c) => emailController.sendAccessGrantedEmail(c)
);

// Trigger Generic Broadcast Email
emailRouter.post(
  '/generic',
  zValidator('json', sendGenericEmailSchema),
  (c) => emailController.sendGenericEmail(c)
);
