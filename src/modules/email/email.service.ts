import {
  queueEnrollmentEmail,
  queuePaymentSuccessEmail,
  queueAccessGrantedEmail,
  queueGenericEmail,
} from '../../queues/index.js';
import {
  SendEnrollmentEmailInput,
  SendPaymentSuccessEmailInput,
  SendAccessGrantedEmailInput,
  SendGenericEmailInput,
} from './email.validation.js';
import { emailRepository } from './email.repository.js';
import { smtpService } from '../../utils/smtp.js';

export class EmailService {
  /**
   * Queue enrollment email notification
   */
  async sendEnrollmentEmail(input: SendEnrollmentEmailInput) {
    const { to, studentName, courseName, startDate, whatsappLink, telegramLink, meetingLink, dashboardUrl } = input;
    const job = await queueEnrollmentEmail(to, {
      studentName,
      courseName,
      startDate,
      whatsappLink,
      telegramLink,
      meetingLink,
      dashboardUrl,
    });

    return {
      queued: true,
      jobId: job.id,
      recipient: to,
      category: 'ENROLLMENT',
    };
  }

  /**
   * Queue payment success receipt email
   */
  async sendPaymentSuccessEmail(input: SendPaymentSuccessEmailInput) {
    const { to, studentName, itemName, amountPaid, currency, transactionId, invoiceId, paymentDate, dashboardUrl } = input;
    const job = await queuePaymentSuccessEmail(to, {
      studentName,
      itemName,
      amountPaid,
      currency,
      transactionId,
      invoiceId,
      paymentDate,
      dashboardUrl,
    });

    return {
      queued: true,
      jobId: job.id,
      recipient: to,
      category: 'PAYMENT_SUCCESS',
    };
  }

  /**
   * Queue access granted notification email
   */
  async sendAccessGrantedEmail(input: SendAccessGrantedEmailInput) {
    const { to, userName, resourceName, accessType, accessTillDate, dashboardUrl } = input;
    const job = await queueAccessGrantedEmail(to, {
      userName,
      resourceName,
      accessType,
      accessTillDate,
      dashboardUrl,
    });

    return {
      queued: true,
      jobId: job.id,
      recipient: to,
      category: 'ACCESS_GRANTED',
    };
  }

  /**
   * Queue generic notification email
   */
  async sendGenericEmail(input: SendGenericEmailInput) {
    const { to, title, message, actionText, actionUrl } = input;
    const job = await queueGenericEmail(to, {
      title,
      message,
      actionText,
      actionUrl,
    });

    return {
      queued: true,
      jobId: job.id,
      recipient: to,
      category: 'GENERIC',
    };
  }

  /**
   * Check SMTP configuration and test connection health
   */
  async checkSmtpHealth() {
    const configured = smtpService.isConfigured();
    const verified = configured ? await smtpService.verifyConnection() : false;

    return {
      configured,
      verified,
      mode: configured ? 'SMTP' : 'Mock/Dev',
    };
  }

  /**
   * Retrieve email queue audit logs
   */
  async getAuditLogs(limit?: number, offset?: number) {
    return emailRepository.getEmailJobLogs(limit, offset);
  }
}

export const emailService = new EmailService();
