import {
  generateEnrollmentEmail,
  generatePaymentSuccessEmail,
  generateAccessGrantedEmail,
  generateGenericEmail,
} from '../../utils/email-templates.js';

export function getEmailPreviewHtml(): string {
  const enrollment = generateEnrollmentEmail({
    studentName: 'Subham Singh',
    courseName: 'Full Stack Web Development Cohort',
    startDate: '2026-08-01',
    whatsappLink: 'https://chat.whatsapp.com/sample-group',
    dashboardUrl: 'https://codekaro.in/dashboard',
  });

  const payment = generatePaymentSuccessEmail({
    studentName: 'Subham Singh',
    itemName: 'Frontend Intensive Cohort',
    amountPaid: 4999,
    currency: 'INR',
    transactionId: 'pay_RPtOk5O3eeVo9F',
    invoiceId: 'inv_RPtOk5O3eeVo9F',
    paymentDate: 'July 20, 2026',
    dashboardUrl: 'https://codekaro.in/dashboard',
  });

  const access = generateAccessGrantedEmail({
    userName: 'Subham Singh',
    resourceName: 'Backend Engineering Masterclass',
    accessType: 'Cohort Access',
    accessTillDate: 'Lifetime Access',
    dashboardUrl: 'https://codekaro.in/dashboard',
  });

  const passwordReset = generateGenericEmail({
    title: 'Password Reset Request',
    message: 'You are receiving this email because we received a password reset request for your account.\n\nThis password reset link will expire in 10 minutes.\n\nIf you did not request a password reset, no further action is required.',
    actionText: 'Reset Password',
    actionUrl: 'https://codekaro.in/reset-password',
  });

  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Templates Live Preview - Codekaro Dev Docs</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['Fira Code', 'monospace']
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #09090b; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
    iframe { border: none; width: 100%; height: 580px; border-radius: 8px; }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-200 antialiased min-h-screen flex flex-col font-normal custom-scrollbar">

  <!-- Header -->
  <header class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs / email preview</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="/docs/implement" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">Implement Guide</a>
        <a href="/docs" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">← API Docs</a>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full space-y-10">
    
    <div class="space-y-3">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-medium border border-indigo-500/20">
        Live Email Preview Sandbox
      </div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Codekaro Minimalist Email UI Preview</h1>
      <p class="text-zinc-400 text-sm max-w-2xl">
        Live preview of rendered HTML emails delivered to users. Built using minimalist typography, pure white cards, black CTA buttons, and standard footer signatures.
      </p>
    </div>

    <!-- Tab Selection Buttons -->
    <div class="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto font-mono text-xs">
      <button onclick="showTab('password')" id="btn-password" class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow transition">1. Password Reset / Generic</button>
      <button onclick="showTab('enrollment')" id="btn-enrollment" class="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition">2. Course Enrollment</button>
      <button onclick="showTab('payment')" id="btn-payment" class="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition">3. Payment Receipt</button>
      <button onclick="showTab('access')" id="btn-access" class="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition">4. Access Granted</button>
    </div>

    <!-- Live Preview Frames -->
    <div class="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 shadow-2xl">
      <div id="tab-password" class="preview-tab">
        <h3 class="text-sm font-mono text-zinc-400 mb-3">Template: Password Reset / System Notification</h3>
        <iframe srcdoc="${escapeHtml(passwordReset.html)}"></iframe>
      </div>

      <div id="tab-enrollment" class="preview-tab hidden">
        <h3 class="text-sm font-mono text-zinc-400 mb-3">Template: Course Enrollment Welcome Email</h3>
        <iframe srcdoc="${escapeHtml(enrollment.html)}"></iframe>
      </div>

      <div id="tab-payment" class="preview-tab hidden">
        <h3 class="text-sm font-mono text-zinc-400 mb-3">Template: Payment Success Receipt</h3>
        <iframe srcdoc="${escapeHtml(payment.html)}"></iframe>
      </div>

      <div id="tab-access" class="preview-tab hidden">
        <h3 class="text-sm font-mono text-zinc-400 mb-3">Template: Access Granted Alert</h3>
        <iframe srcdoc="${escapeHtml(access.html)}"></iframe>
      </div>
    </div>
  </main>

  <script>
    function showTab(tabName) {
      document.querySelectorAll('.preview-tab').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('button[id^="btn-"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition';
      });

      document.getElementById('tab-' + tabName).classList.remove('hidden');
      document.getElementById('btn-' + tabName).className = 'px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow transition';
    }
  </script>

  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developer Documentation • Email Template Preview Sandbox
  </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/"/g, '&quot;');
}
