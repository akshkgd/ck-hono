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
 * Base HTML Template wrapper for responsive, consistent email rendering across clients.
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
      background-color: #f4f6f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f4f6f9;
      padding: 30px 0;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 28px 32px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #94a3b8;
      margin: 6px 0 0 0;
      font-size: 13px;
    }
    .content {
      padding: 32px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-weight: 600;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 8px;
      text-decoration: none;
      margin: 20px 0 10px 0;
      box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }
    .badge-success {
      display: inline-block;
      background-color: #dcfce7;
      color: #166534;
      font-weight: 600;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table td {
      padding: 10px 14px;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    .info-table td.label {
      color: #64748b;
      font-weight: 500;
      width: 40%;
    }
    .info-table td.value {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header">
        <h1>Coding Kampus</h1>
        <p>Empowering Tech Learning & Career Growth</p>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p>© ${currentYear} Coding Kampus. All rights reserved.</p>
        <p>Need help? Contact support at <a href="mailto:support@codingkampus.com">support@codingkampus.com</a></p>
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
    startDate = 'Immediately Available',
    whatsappLink,
    telegramLink,
    meetingLink,
    dashboardUrl = process.env.FRONTEND_URL || 'https://codingkampus.com/dashboard',
  } = payload;

  const subject = `Welcome to ${courseName}! Enrollment Confirmed 🎉`;

  const communityLinks = [];
  if (whatsappLink) {
    communityLinks.push(`<a href="${whatsappLink}" style="color: #16a34a; font-weight: 600; text-decoration: none;">Join WhatsApp Group →</a>`);
  }
  if (telegramLink) {
    communityLinks.push(`<a href="${telegramLink}" style="color: #0284c7; font-weight: 600; text-decoration: none;">Join Telegram Channel →</a>`);
  }
  if (meetingLink) {
    communityLinks.push(`<a href="${meetingLink}" style="color: #2563eb; font-weight: 600; text-decoration: none;">Live Class Room Link →</a>`);
  }

  const html = renderBaseLayout(
    subject,
    `
    <span class="badge-success">✓ Enrollment Active</span>
    <h2 style="margin-top: 8px; color: #0f172a;">Welcome aboard, ${studentName}!</h2>
    <p style="color: #475569; line-height: 1.6;">
      Congratulations! Your enrollment for <strong>${courseName}</strong> has been successfully confirmed. You now have access to your learning materials and cohort features.
    </p>

    <table class="info-table">
      <tr>
        <td class="label">Course Name</td>
        <td class="value">${courseName}</td>
      </tr>
      <tr>
        <td class="label">Start Date</td>
        <td class="value">${startDate}</td>
      </tr>
      <tr>
        <td class="label">Student Name</td>
        <td class="value">${studentName}</td>
      </tr>
    </table>

    ${communityLinks.length > 0 ? `
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0; color: #1e293b;">Cohort Community Links:</h4>
      <ul style="margin: 0; padding-left: 20px; color: #334155;">
        ${communityLinks.map(link => `<li style="margin-bottom: 6px;">${link}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="btn">Go to Learning Dashboard</a>
    </div>

    <p style="color: #64748b; font-size: 13px; margin-top: 24px; line-height: 1.5;">
      If you have any questions or require assistance setting up your environment, reply directly to this email or reach out via our community links.
    </p>
    `
  );

  const text = `Hi ${studentName},

Welcome aboard! Your enrollment for ${courseName} is confirmed.
Start Date: ${startDate}

Dashboard: ${dashboardUrl}

Happy learning!
- Coding Kampus Team`;

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
    dashboardUrl = process.env.FRONTEND_URL || 'https://codingkampus.com/dashboard',
  } = payload;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amountPaid);

  const subject = `Payment Receipt for ${itemName} [${transactionId}]`;

  const html = renderBaseLayout(
    subject,
    `
    <span class="badge-success">✓ Payment Received</span>
    <h2 style="margin-top: 8px; color: #0f172a;">Payment Receipt</h2>
    <p style="color: #475569; line-height: 1.6;">
      Hi ${studentName}, thank you for your payment! We have successfully received your payment for <strong>${itemName}</strong>.
    </p>

    <table class="info-table">
      <tr>
        <td class="label">Item Purchased</td>
        <td class="value">${itemName}</td>
      </tr>
      <tr>
        <td class="label">Amount Paid</td>
        <td class="value" style="color: #16a34a; font-size: 16px;">${formattedAmount}</td>
      </tr>
      <tr>
        <td class="label">Transaction ID</td>
        <td class="value">${transactionId}</td>
      </tr>
      <tr>
        <td class="label">Invoice ID</td>
        <td class="value">${invoiceId}</td>
      </tr>
      <tr>
        <td class="label">Payment Date</td>
        <td class="value">${paymentDate}</td>
      </tr>
    </table>

    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="btn">View Order & Access Course</a>
    </div>

    <p style="color: #64748b; font-size: 13px; margin-top: 24px; line-height: 1.5;">
      Keep this email as your official receipt for this transaction.
    </p>
    `
  );

  const text = `Hi ${studentName},

Thank you for your payment!
Item: ${itemName}
Amount: ${formattedAmount}
Transaction ID: ${transactionId}
Invoice ID: ${invoiceId}
Date: ${paymentDate}

Access your item at: ${dashboardUrl}

Thank you,
- Coding Kampus Team`;

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
    accessTillDate = 'Lifetime / Unlimited',
    dashboardUrl = process.env.FRONTEND_URL || 'https://codingkampus.com/dashboard',
  } = payload;

  const subject = `Access Granted to ${resourceName} 🔑`;

  const html = renderBaseLayout(
    subject,
    `
    <span class="badge-success">✓ Access Granted</span>
    <h2 style="margin-top: 8px; color: #0f172a;">Access Granted</h2>
    <p style="color: #475569; line-height: 1.6;">
      Hi ${userName}, access to <strong>${resourceName}</strong> has been granted to your account.
    </p>

    <table class="info-table">
      <tr>
        <td class="label">Resource / Course</td>
        <td class="value">${resourceName}</td>
      </tr>
      <tr>
        <td class="label">Access Permission</td>
        <td class="value">${accessType}</td>
      </tr>
      <tr>
        <td class="label">Valid Until</td>
        <td class="value">${accessTillDate}</td>
      </tr>
    </table>

    <div style="text-align: center;">
      <a href="${dashboardUrl}" class="btn">Access Resource Now</a>
    </div>
    `
  );

  const text = `Hi ${userName},

Access to ${resourceName} has been granted.
Type: ${accessType}
Valid Until: ${accessTillDate}

Access URL: ${dashboardUrl}

Best regards,
- Coding Kampus Team`;

  return { subject, html, text };
}

/**
 * 4. Generic / Custom System Notification Email Template
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
    <h2 style="margin-top: 8px; color: #0f172a;">${title}</h2>
    <div style="color: #475569; line-height: 1.6; white-space: pre-line; margin: 16px 0;">
      ${message}
    </div>

    ${actionText && actionUrl ? `
    <div style="text-align: center;">
      <a href="${actionUrl}" class="btn">${actionText}</a>
    </div>
    ` : ''}
    `
  );

  const text = `${title}

${message}

${actionText && actionUrl ? `${actionText}: ${actionUrl}` : ''}

- Coding Kampus Team`;

  return { subject, html, text };
}
