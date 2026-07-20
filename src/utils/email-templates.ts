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
  amountPaid: number; // In main currency (e.g. 4999 INR)
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
 * Base HTML Template wrapper with neutral colors, zero border-radius, and default font.
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
    h1, h2 {
      color: #171717;
      margin: 0 0 20px 0;
      font-size: 22px;
      font-weight: 600;
    }
    p {
      color: #171717;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .btn {
      display: inline-block;
      background-color: #171717;
      color: #ffffff !important;
      font-weight: 500;
      font-size: 14px;
      padding: 12px 22px;
      border-radius: 0px;
      text-decoration: none;
      margin: 10px 0 24px 0;
    }
    .regards {
      margin-top: 24px;
      margin-bottom: 0;
      color: #171717;
      font-size: 15px;
      line-height: 1.6;
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
    .info-box {
      background-color: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 0px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      border-bottom: 1px solid #e5e5e5;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #525252;
    }
    .info-val {
      color: #171717;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      ${contentHtml}

      <div class="regards">
        Regards,<br>
        <strong>Codekaro</strong>
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
    startDate = 'Immediate Access',
    whatsappLink,
    telegramLink,
    meetingLink,
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const subject = `Welcome to ${courseName}! Enrollment Confirmed 🎉`;

  const html = renderBaseLayout(
    subject,
    `
    <h1>Hello ${studentName}!</h1>

    <p>
      You are receiving this email because your enrollment for <strong>${courseName}</strong> has been successfully confirmed.
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Course Name</span>
        <span class="info-val">${courseName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Start Date</span>
        <span class="info-val">${startDate}</span>
      </div>
    </div>

    ${whatsappLink || telegramLink || meetingLink ? `
    <p><strong>Cohort Community & Meeting Links:</strong></p>
    <p>
      ${whatsappLink ? `<a href="${whatsappLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Join WhatsApp Group →</a><br>` : ''}
      ${telegramLink ? `<a href="${telegramLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Join Telegram Channel →</a><br>` : ''}
      ${meetingLink ? `<a href="${meetingLink}" style="color: #171717; font-weight: 600; text-decoration: underline;">Live Class Link →</a><br>` : ''}
    </p>
    ` : ''}

    <div>
      <a href="${dashboardUrl}" class="btn">Access Dashboard</a>
    </div>

    <p>If you did not request this enrollment or need any assistance, feel free to contact our support team.</p>
    `
  );

  const text = `Hello ${studentName}!

Your enrollment for ${courseName} is confirmed.
Start Date: ${startDate}

Dashboard: ${dashboardUrl}

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
    transactionId = 'N/A',
    invoiceId = 'N/A',
    paymentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amountPaid);

  const subject = `Payment Receipt for ${itemName}`;

  const html = renderBaseLayout(
    subject,
    `
    <h1>Hello ${studentName}!</h1>

    <p>
      Thank you for your payment! We have successfully received your payment for <strong>${itemName}</strong>.
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Item Purchased</span>
        <span class="info-val">${itemName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amount Paid</span>
        <span class="info-val">${formattedAmount}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction ID</span>
        <span class="info-val">${transactionId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Invoice ID</span>
        <span class="info-val">${invoiceId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Payment Date</span>
        <span class="info-val">${paymentDate}</span>
      </div>
    </div>

    <div>
      <a href="${dashboardUrl}" class="btn">View Order & Course</a>
    </div>

    <p>This email serves as your official transaction receipt.</p>
    `
  );

  const text = `Hello ${studentName}!

Thank you for your payment for ${itemName}.
Amount: ${formattedAmount}
Transaction ID: ${transactionId}
Invoice ID: ${invoiceId}
Date: ${paymentDate}

Dashboard: ${dashboardUrl}

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
    accessType = 'Full Access',
    accessTillDate = 'Unlimited Access',
    dashboardUrl = process.env.FRONTEND_URL || 'https://codekaro.in/dashboard',
  } = payload;

  const subject = `Access Granted to ${resourceName}`;

  const html = renderBaseLayout(
    subject,
    `
    <h1>Hello ${userName}!</h1>

    <p>
      Access to <strong>${resourceName}</strong> has been granted to your Codekaro account.
    </p>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">Resource</span>
        <span class="info-val">${resourceName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Access Type</span>
        <span class="info-val">${accessType}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Valid Until</span>
        <span class="info-val">${accessTillDate}</span>
      </div>
    </div>

    <div>
      <a href="${dashboardUrl}" class="btn">Access Resource</a>
    </div>

    <p>If you have any questions, feel free to reply to this email.</p>
    `
  );

  const text = `Hello ${userName}!

Access to ${resourceName} has been granted.
Access Type: ${accessType}
Valid Until: ${accessTillDate}

Dashboard: ${dashboardUrl}

Regards,
Codekaro

Electronic City Phase-1, Bengaluru, BLR 560100, India
© ${new Date().getFullYear()} Codekaro. All rights reserved.`;

  return { subject, html, text };
}

/**
 * 4. Generic Notification Email Template
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
    <h1>Hello!</h1>

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
