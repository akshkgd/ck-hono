import { EmailJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';
import { smtpService } from '../utils/smtp.js';
import {
  generateEnrollmentEmail,
  generatePaymentSuccessEmail,
  generateAccessGrantedEmail,
  generateGenericEmail,
  EnrollmentTemplatePayload,
  PaymentSuccessTemplatePayload,
  AccessGrantedTemplatePayload,
  GenericTemplatePayload,
} from '../utils/email-templates.js';

export async function processEmailJob(data: EmailJobData): Promise<Record<string, any>> {
  const startTime = Date.now();
  const recipientStr = Array.isArray(data.to) ? data.to.join(', ') : data.to;

  logger.info(`[EmailJob] Processing category: "${data.category || 'CUSTOM'}" email to: ${recipientStr}`);

  if (!data.to || (typeof data.to === 'string' && !data.to.includes('@'))) {
    throw new Error(`Invalid email recipient: ${data.to}`);
  }

  let finalSubject = data.subject;
  let finalHtml = data.html || '';
  let finalText = data.body || '';

  // Generate content based on template category
  if (data.category === 'ENROLLMENT' && data.payload) {
    const rendered = generateEnrollmentEmail(data.payload as EnrollmentTemplatePayload);
    finalSubject = data.subject || rendered.subject;
    finalHtml = rendered.html;
    finalText = rendered.text;
  } else if (data.category === 'PAYMENT_SUCCESS' && data.payload) {
    const rendered = generatePaymentSuccessEmail(data.payload as PaymentSuccessTemplatePayload);
    finalSubject = data.subject || rendered.subject;
    finalHtml = rendered.html;
    finalText = rendered.text;
  } else if (data.category === 'ACCESS_GRANTED' && data.payload) {
    const rendered = generateAccessGrantedEmail(data.payload as AccessGrantedTemplatePayload);
    finalSubject = data.subject || rendered.subject;
    finalHtml = rendered.html;
    finalText = rendered.text;
  } else if (data.category === 'GENERIC' && data.payload) {
    const rendered = generateGenericEmail(data.payload as GenericTemplatePayload);
    finalSubject = data.subject || rendered.subject;
    finalHtml = rendered.html;
    finalText = rendered.text;
  } else if (!finalHtml && !finalText) {
    // Fallback if raw body provided
    finalHtml = `<p>${data.body || data.subject}</p>`;
    finalText = data.body || data.subject;
  }

  // Dispatch email via Nodemailer SMTP Service
  const result = await smtpService.sendEmail({
    to: data.to,
    subject: finalSubject,
    html: finalHtml,
    text: finalText,
    cc: data.cc,
    bcc: data.bcc,
  });

  const durationMs = Date.now() - startTime;
  logger.info(`[EmailJob] Email successfully processed for [${recipientStr}] via ${result.mode} in ${durationMs}ms`);

  return {
    delivered: result.success,
    mode: result.mode,
    messageId: result.messageId,
    recipient: data.to,
    subject: finalSubject,
    category: data.category || 'CUSTOM',
    sentAt: new Date().toISOString(),
    durationMs,
  };
}
