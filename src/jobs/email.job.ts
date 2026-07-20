import { EmailJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';

export async function processEmailJob(data: EmailJobData): Promise<Record<string, any>> {
  const startTime = Date.now();
  logger.info(`[EmailJob] Processing email to: ${data.to}, Subject: "${data.subject}"`);

  // Simulate or call external email service provider (e.g. Resend, SendGrid, Nodemailer)
  // In production, integrate your SMTP or HTTP mail API client here
  if (!data.to || !data.to.includes('@')) {
    throw new Error(`Invalid email recipient: ${data.to}`);
  }

  // Simulated delivery delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const durationMs = Date.now() - startTime;
  logger.info(`[EmailJob] Email successfully sent to ${data.to} in ${durationMs}ms`);

  return {
    delivered: true,
    recipient: data.to,
    subject: data.subject,
    sentAt: new Date().toISOString(),
    durationMs,
  };
}
