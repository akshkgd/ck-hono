import 'dotenv/config';
import { smtpService } from '../src/utils/smtp.js';
import { queueEnrollmentEmail, queuePaymentSuccessEmail } from '../src/queues/index.js';

async function main() {
  const targetEmail = process.argv[2] || process.env.SMTP_USER || 'test@example.com';

  console.log(`\n📧 Testing Email Utility for recipient: ${targetEmail}`);
  console.log('----------------------------------------------------');

  // 1. Direct SMTP Connection & Transmission Test
  console.log('1️⃣ Testing Direct SMTP Transporter...');
  const health = await smtpService.verifyConnection();
  console.log(`   SMTP Connection Status: ${health ? '✅ SUCCESS' : '❌ FAILED'}`);

  if (health || !smtpService.isConfigured()) {
    console.log('\n2️⃣ Sending Direct Test Email...');
    const result = await smtpService.sendEmail({
      to: targetEmail,
      subject: 'Test Email from Codekaro Backend 🚀',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb;">SMTP Integration Verification</h2>
          <p>If you received this email, your SMTP settings in <code>.env</code> are fully working!</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
    });
    console.log('   Send Result:', result);
  }

  // 2. Queue Dispatch Test
  console.log('\n3️⃣ Testing BullMQ Email Queue Dispatch...');
  try {
    const job1 = await queueEnrollmentEmail(targetEmail, {
      studentName: 'Test Student',
      courseName: 'Full Stack Web Development Cohort',
      startDate: 'Immediate Access',
      whatsappLink: 'https://chat.whatsapp.com/test-group',
    });
    console.log(`   ✅ Enrollment Email Queued! Job ID: ${job1.id}`);

    const job2 = await queuePaymentSuccessEmail(targetEmail, {
      studentName: 'Test Student',
      itemName: 'Full Stack Web Development Cohort',
      amountPaid: 4999,
      transactionId: `pay_test_${Date.now()}`,
      invoiceId: `inv_test_${Date.now()}`,
    });
    console.log(`   ✅ Payment Success Email Queued! Job ID: ${job2.id}`);
  } catch (err: any) {
    console.error('   ❌ Failed to queue email (Is Redis running?):', err.message);
  }

  console.log('\n----------------------------------------------------');
  console.log('Done! Check your inbox or terminal output.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error in test script:', err);
  process.exit(1);
});
