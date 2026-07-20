import { describe, it, expect } from 'vitest';
import {
  generateEnrollmentEmail,
  generatePaymentSuccessEmail,
  generateAccessGrantedEmail,
  generateGenericEmail,
} from '../../utils/email-templates.js';
import {
  sendEnrollmentEmailSchema,
  sendPaymentSuccessEmailSchema,
  sendAccessGrantedEmailSchema,
  sendGenericEmailSchema,
} from './email.validation.js';

describe('Email Utility & Template Generators', () => {
  it('should generate responsive HTML for enrollment email', () => {
    const rendered = generateEnrollmentEmail({
      studentName: 'Rahul Sharma',
      courseName: 'Full Stack Web Development',
      startDate: '2026-08-01',
      whatsappLink: 'https://chat.whatsapp.com/sample',
    });

    expect(rendered.subject).toContain('Full Stack Web Development');
    expect(rendered.html).toContain('Rahul Sharma');
    expect(rendered.html).toContain('Full Stack Web Development');
    expect(rendered.html).toContain('https://chat.whatsapp.com/sample');
    expect(rendered.text).toContain('Rahul Sharma');
  });

  it('should generate responsive HTML for payment success email', () => {
    const rendered = generatePaymentSuccessEmail({
      studentName: 'Priya Verma',
      itemName: 'Backend Engineering Masterclass',
      amountPaid: 4999,
      transactionId: 'pay_P12345678',
      invoiceId: 'inv_1009',
    });

    expect(rendered.subject).toContain('pay_P12345678');
    expect(rendered.html).toContain('Priya Verma');
    expect(rendered.html).toContain('Backend Engineering Masterclass');
    expect(rendered.html).toContain('pay_P12345678');
    expect(rendered.html).toContain('inv_1009');
  });

  it('should generate responsive HTML for access granted email', () => {
    const rendered = generateAccessGrantedEmail({
      userName: 'Amit Kumar',
      resourceName: 'Advanced System Design',
      accessType: 'Lifetime Access',
    });

    expect(rendered.subject).toContain('Advanced System Design');
    expect(rendered.html).toContain('Amit Kumar');
    expect(rendered.html).toContain('Lifetime Access');
  });

  it('should generate responsive HTML for generic email', () => {
    const rendered = generateGenericEmail({
      title: 'Platform Maintenance Scheduled',
      message: 'We will undergo scheduled server maintenance on Sunday.',
      actionText: 'View Schedule',
      actionUrl: 'https://codingkampus.com/status',
    });

    expect(rendered.subject).toBe('Platform Maintenance Scheduled');
    expect(rendered.html).toContain('scheduled server maintenance');
    expect(rendered.html).toContain('https://codingkampus.com/status');
  });

  it('should validate sendEnrollmentEmailSchema correctly', () => {
    const validData = {
      to: 'student@example.com',
      studentName: 'Rohan',
      courseName: 'Node.js Deep Dive',
      whatsappLink: 'https://whatsapp.com/invite',
    };

    const parsed = sendEnrollmentEmailSchema.safeParse(validData);
    expect(parsed.success).toBe(true);

    const invalidData = {
      to: 'invalid-email',
      studentName: '',
      courseName: 'Node.js',
    };
    const invalidParsed = sendEnrollmentEmailSchema.safeParse(invalidData);
    expect(invalidParsed.success).toBe(false);
  });

  it('should validate sendPaymentSuccessEmailSchema correctly', () => {
    const validData = {
      to: ['student1@example.com', 'student2@example.com'],
      studentName: 'Sneha',
      itemName: 'DSA Course',
      amountPaid: 2999,
      currency: 'INR',
    };

    const parsed = sendPaymentSuccessEmailSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });
});
