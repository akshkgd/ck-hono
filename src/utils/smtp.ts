import nodemailer, { Transporter } from 'nodemailer';
import { logger } from './logger.js';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  mode: 'smtp' | 'mock';
  accepted?: string[];
  rejected?: string[];
  error?: string;
}

class SmtpService {
  private transporter: Transporter | null = null;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.EMAIL_FROM || '"Coding Kampus" <noreply@codingkampus.com>';
    this.initTransporter();
  }

  private initTransporter(): void {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const encryption = (process.env.MAIL_ENCRYPTION || '').toLowerCase();
    const secure = process.env.SMTP_SECURE === 'true' || port === 465 || encryption === 'ssl';

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      });
      logger.info(`[SMTP] Transporter initialized for host: ${host}:${port}`);
    } else {
      logger.warn('[SMTP] Configuration incomplete (SMTP_HOST/USER/PASS missing). Running in Mock/Dev mode.');
      this.transporter = null;
    }
  }

  public isConfigured(): boolean {
    return this.transporter !== null;
  }

  public async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      logger.warn('[SMTP] Cannot verify connection: running in Mock mode.');
      return false;
    }

    try {
      await this.transporter.verify();
      logger.info('[SMTP] Connection verified successfully.');
      return true;
    } catch (err: any) {
      logger.error(`[SMTP] Verification failed: ${err.message}`);
      return false;
    }
  }

  public async sendEmail(options: SendMailOptions): Promise<SendMailResult> {
    const from = this.defaultFrom;
    const { to, subject, html, text, cc, bcc, replyTo } = options;

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]+>/g, ''),
          cc,
          bcc,
          replyTo,
        });

        logger.info(`[SMTP] Email sent to [${Array.isArray(to) ? to.join(', ') : to}] with MessageID: ${info.messageId}`);

        return {
          success: true,
          messageId: info.messageId,
          mode: 'smtp',
          accepted: info.accepted as string[],
          rejected: info.rejected as string[],
        };
      } catch (err: any) {
        logger.error(`[SMTP] Failed to send email to [${Array.isArray(to) ? to.join(', ') : to}]: ${err.message}`);
        throw err;
      }
    } else {
      // Development / Mock mode
      const recipients = Array.isArray(to) ? to.join(', ') : to;
      logger.info('================ [MOCK SMTP EMAIL] ================');
      logger.info(`From: ${from}`);
      logger.info(`To: ${recipients}`);
      logger.info(`Subject: ${subject}`);
      if (cc) logger.info(`CC: ${Array.isArray(cc) ? cc.join(', ') : cc}`);
      if (bcc) logger.info(`BCC: ${Array.isArray(bcc) ? bcc.join(', ') : bcc}`);
      logger.info('--- Preview text ---');
      logger.info((text || html.replace(/<[^>]+>/g, '')).slice(0, 300) + '...');
      logger.info('===================================================');

      return {
        success: true,
        messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        mode: 'mock',
        accepted: Array.isArray(to) ? to : [to],
        rejected: [],
      };
    }
  }
}

export const smtpService = new SmtpService();
