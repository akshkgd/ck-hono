export interface EnrollmentTemplatePayload {
  studentName: string;
  courseName: string;
  startDate?: string;
  whatsappLink?: string;
  telegramLink?: string;
  meetingLink?: string;
  dashboardUrl?: string;
}

export interface PaymentSuccessTemplatePayload {
  studentName: string;
  itemName: string;
  amountPaid: number;
  currency?: string;
  transactionId?: string;
  invoiceId?: string;
  paymentDate?: string;
  dashboardUrl?: string;
}

export interface AccessGrantedTemplatePayload {
  userName: string;
  resourceName: string;
  accessType?: string;
  accessTillDate?: string;
  dashboardUrl?: string;
}

export interface GenericTemplatePayload {
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
}

/**
 * Base HTML Template wrapper matching Codekaro minimalist email design specification.
 */
function renderBaseLayout(title: string, contentHtml: string): string {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      font-family: sans-serif;
      color: #171717;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #ffffff;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .main-card {
      max-width: 580px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0px;
      padding: 40px;
      box-sizing: border-box;
    }
    p {
      color: #171717;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
      font-weight: normal;
    }
    .btn {
      display: inline-block;
      background-color: #000000;
      color: #ffffff !important;
      font-weight: 500;
      font-size: 14px;
      padding: 12px 22px;
      border-radius: 0px;
      text-decoration: none;
      margin: 10px 0 24px 0;
    }
    .regards {
      margin-top: 28px;
      margin-bottom: 0;
      color: #171717;
      font-size: 15px;
      line-height: 1.6;
      font-weight: normal;
    }
    .divider {
      border-top: 1px solid #e5e5e5;
      margin-top: 32px;
      padding-top: 24px;
    }
    .footer-text {
      color: #525252;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      ${contentHtml}

      <div class="regards">
        Regards,<br>
        Codekaro
      </div>

      <div class="divider">
        <p class="footer-text">
          Electronic City Phase-1, Bengaluru, BLR 560100, India<br>
          © ${currentYear} Codekaro. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Enrollment Email Template
 */
export function generateEnrollmentEmail(payload: EnrollmentTemplatePayload): { subject: string; html: string; text: string } {
  const {
    studentName,
    courseName,
    whatsappLink,
    telegramLink,
    meetingLink,
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const nameGreeting = studentName ? ` ${studentName}` : '';
  const subject = `Welcome to ${courseName}! Enrollment Confirmed 🎉`;

  const html = renderBaseLayout(
    subject,
    `
    <p>Hello${nameGreeting}!</p>

    <p>You now have access to <strong>${courseName}</strong>.</p>

    ${whatsappLink || telegramLink || meetingLink ? `
    <p>
      ${whatsappLink ? `<a href="${whatsappLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Join WhatsApp Group →</a><br>` : ''}
      ${telegramLink ? `<a href="${telegramLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Join Telegram Channel →</a><br>` : ''}
      ${meetingLink ? `<a href="${meetingLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Live Class Link →</a><br>` : ''}
    </p>
    ` : ''}

    <div>
      <a href="${dashboardUrl}" class="btn">Start Learning</a>
    </div>
    `
  );

  const text = `Hello${nameGreeting}!

You now have access to ${courseName}.

Start Learning: ${dashboardUrl}

Regards,
Codekaro

Electronic City Phase-1, Bengaluru, BLR 560100, India
© ${new Date().getFullYear()} Codekaro. All rights reserved.`;

  return { subject, html, text };
}

/**
 * 2. Payment Success Email Template
 */
export function generatePaymentSuccessEmail(payload: PaymentSuccessTemplatePayload): { subject: string; html: string; text: string } {
  const {
    studentName,
    itemName,
    amountPaid,
    currency = 'INR',
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amountPaid);

  const nameGreeting = studentName ? ` ${studentName}` : '';
  const subject = `Payment Receipt for ${itemName}`;

  const html = renderBaseLayout(
    subject,
    `
    <p>Hello${nameGreeting}!</p>

    <p>We received your payment of <strong>${formattedAmount}</strong> for <strong>${itemName}</strong>.</p>

    <div>
      <a href="${dashboardUrl}" class="btn">Access Course</a>
    </div>
    `
  );

  const text = `Hello${nameGreeting}!

We received your payment of ${formattedAmount} for ${itemName}.

Access Course: ${dashboardUrl}

Regards,
Codekaro

Electronic City Phase-1, Bengaluru, BLR 560100, India
© ${new Date().getFullYear()} Codekaro. All rights reserved.`;

  return { subject, html, text };
}

/**
 * 3. Access Granted Email Template
 */
export function generateAccessGrantedEmail(payload: AccessGrantedTemplatePayload): { subject: string; html: string; text: string } {
  const {
    userName,
    resourceName,
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const nameGreeting = userName ? ` ${userName}` : '';
  const subject = `Access Granted to ${resourceName}`;

  const html = renderBaseLayout(
    subject,
    `
    <p>Hello${nameGreeting}!</p>

    <p>You now have access to <strong>${resourceName}</strong>.</p>

    <div>
      <a href="${dashboardUrl}" class="btn">Start Learning</a>
    </div>
    `
  );

  const text = `Hello${nameGreeting}!

You now have access to ${resourceName}.

Start Learning: ${dashboardUrl}

Regards,
Codekaro

Electronic City Phase-1, Bengaluru, BLR 560100, India
© ${new Date().getFullYear()} Codekaro. All rights reserved.`;

  return { subject, html, text };
}

/**
 * 4. Generic / Password Reset Notification Email Template
 */
export function generateGenericEmail(payload: GenericTemplatePayload): { subject: string; html: string; text: string } {
  const {
    title,
    message,
    actionText,
    actionUrl,
  } = payload;

  const subject = title;

  const html = renderBaseLayout(
    subject,
    `
    <p>Hello!</p>

    <p style="white-space: pre-line;">${message}</p>

    ${actionText && actionUrl ? `
    <div>
      <a href="${actionUrl}" class="btn">${actionText}</a>
    </div>
    ` : ''}
    `
  );

  const text = `Hello!

${message}

${actionText && actionUrl ? `${actionText}: ${actionUrl}` : ''}

Regards,
Codekaro

Electronic City Phase-1, Bengaluru, BLR 560100, India
© ${new Date().getFullYear()} Codekaro. All rights reserved.`;

  return { subject, html, text };
}
