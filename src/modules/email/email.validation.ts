import { z } from 'zod';

export const sendEnrollmentEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  studentName: z.string().min(1, 'Student name is required'),
  courseName: z.string().min(1, 'Course name is required'),
  startDate: z.string().optional(),
  whatsappLink: z.string().url().optional(),
  telegramLink: z.string().url().optional(),
  meetingLink: z.string().url().optional(),
  dashboardUrl: z.string().url().optional(),
});

export const sendPaymentSuccessEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  studentName: z.string().min(1, 'Student name is required'),
  itemName: z.string().min(1, 'Item name is required'),
  amountPaid: z.number().positive('Amount paid must be positive'),
  currency: z.string().default('INR'),
  transactionId: z.string().optional(),
  invoiceId: z.string().optional(),
  paymentDate: z.string().optional(),
  dashboardUrl: z.string().url().optional(),
});

export const sendAccessGrantedEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  userName: z.string().min(1, 'User name is required'),
  resourceName: z.string().min(1, 'Resource name is required'),
  accessType: z.string().optional(),
  accessTillDate: z.string().optional(),
  dashboardUrl: z.string().url().optional(),
});

export const sendGenericEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message content is required'),
  actionText: z.string().optional(),
  actionUrl: z.string().url().optional(),
});

export type SendEnrollmentEmailInput = z.infer<typeof sendEnrollmentEmailSchema>;
export type SendPaymentSuccessEmailInput = z.infer<typeof sendPaymentSuccessEmailSchema>;
export type SendAccessGrantedEmailInput = z.infer<typeof sendAccessGrantedEmailSchema>;
export type SendGenericEmailInput = z.infer<typeof sendGenericEmailSchema>;
