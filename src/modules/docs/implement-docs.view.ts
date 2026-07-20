export function getImplementDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frontend Implementation Guide - Codekaro Dev Docs</title>
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
  </style>
</head>
<body class="bg-zinc-950 text-zinc-200 antialiased min-h-screen flex flex-col font-normal custom-scrollbar">

  <!-- Navigation Header -->
  <header class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs / implement</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="/docs/payments" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">Payment Docs</a>
        <a href="/docs" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">← API Docs</a>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-12">

    <!-- Hero / Title Section -->
    <section class="space-y-4">
      <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-medium border border-indigo-500/20">
        Frontend Implementation Checklist
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Frontend Feature Implementation Guide</h1>
      <p class="text-zinc-400 text-base max-w-2xl">
        Complete reference for frontend engineers implementing the dynamic Admin Email Settings UI, manual trigger APIs, notification suppressions, and queue health monitoring.
      </p>
    </section>

    <!-- Overview Cards -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-2">
        <div class="text-indigo-400 font-mono text-sm font-semibold flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-indigo-500"></span> 1. Dynamic Admin Toggles UI
        </div>
        <p class="text-zinc-400 text-xs leading-relaxed">
          Build UI switches in the Admin Panel to enable/disable email notifications dynamically without server restarts.
        </p>
      </div>
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-2">
        <div class="text-emerald-400 font-mono text-sm font-semibold flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> 2. Manual Email Trigger APIs
        </div>
        <p class="text-zinc-400 text-xs leading-relaxed">
          Allow admins to dispatch enrollment, receipt, access granted, or custom announcement emails directly.
        </p>
      </div>
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-2">
        <div class="text-amber-400 font-mono text-sm font-semibold flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-amber-500"></span> 3. Learner Notification Suppress
        </div>
        <p class="text-zinc-400 text-xs leading-relaxed">
          Pass <code>"notifyUser": false</code> when adding manual enrollments during bulk imports or test account setups.
        </p>
      </div>
      <div class="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 space-y-2">
        <div class="text-purple-400 font-mono text-sm font-semibold flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-purple-500"></span> 4. Queue Audit & Health Dashboard
        </div>
        <p class="text-zinc-400 text-xs leading-relaxed">
          Monitor SMTP connection health, worker status, and audit log history in real-time.
        </p>
      </div>
    </section>

    <!-- SECTION 1: DYNAMIC ADMIN EMAIL SETTINGS -->
    <section class="space-y-6 pt-4 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-indigo-400 font-medium uppercase tracking-wider">Feature #1</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Admin Dynamic Email Settings UI</h2>
        <p class="text-zinc-400 text-sm">
          Implement a Settings page in the Admin Dashboard with toggle switches for global and category-level email dispatching.
        </p>
      </div>

      <!-- GET Email Settings -->
      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">GET</span>
            <span class="text-zinc-200 font-semibold">/v1/admin/email-settings</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Admin Auth</span>
        </div>
        <p class="text-xs text-zinc-400">Fetch current toggle states when loading the Admin Settings UI page.</p>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Response (200 OK):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "success": true,
  "message": "Email settings retrieved successfully",
  "data": {
    "enabled": true,
    "enrollment": true,
    "payment": true,
    "accessGranted": true
  }
}</code></pre>
        </div>
      </div>

      <!-- PUT Email Settings -->
      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">PUT</span>
            <span class="text-zinc-200 font-semibold">/v1/admin/email-settings</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Admin Auth</span>
        </div>
        <p class="text-xs text-zinc-400">Call when the administrator toggles any switch in the UI.</p>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Request Payload:</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "enabled": true,
  "enrollment": true,
  "payment": true,
  "accessGranted": false
}</code></pre>
        </div>
      </div>
    </section>

    <!-- SECTION 2: MANUAL EMAIL DISPATCH APIS -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Feature #2</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">User-Specific & Manual Email Dispatch APIs</h2>
        <p class="text-zinc-400 text-sm">
          Use these endpoints to manually trigger custom emails or resend lost receipts/enrollments directly from student profiles in the Admin Frontend.
        </p>
      </div>

      <!-- Endpoint Cards -->
      <div class="space-y-4">

        <!-- Enrollment Email -->
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/enrollment</span>
          </div>
          <p class="text-xs text-zinc-400">Queue welcome & onboarding email for a student.</p>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "to": "student@example.com",
  "studentName": "Rahul Sharma",
  "courseName": "Full Stack Web Development",
  "startDate": "2026-08-01",
  "whatsappLink": "https://chat.whatsapp.com/sample",
  "dashboardUrl": "https://codekaro.in/dashboard"
}</code></pre>
        </div>

        <!-- Payment Success Email -->
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/payment-success</span>
          </div>
          <p class="text-xs text-zinc-400">Queue payment receipt email for a completed purchase.</p>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "to": "student@example.com",
  "studentName": "Rahul Sharma",
  "itemName": "Full Stack Web Development Cohort",
  "amountPaid": 4999,
  "currency": "INR",
  "transactionId": "pay_P12345678",
  "invoiceId": "inv_1009",
  "dashboardUrl": "https://codekaro.in/dashboard"
}</code></pre>
        </div>

        <!-- Access Granted Email -->
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/access-granted</span>
          </div>
          <p class="text-xs text-zinc-400">Queue access granted alert when assigning course resources or renewing access.</p>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "to": "student@example.com",
  "userName": "Rahul Sharma",
  "resourceName": "Advanced System Design Module",
  "accessType": "Cohort Subscription",
  "dashboardUrl": "https://codekaro.in/dashboard"
}</code></pre>
        </div>

        <!-- Generic / Broadcast Email -->
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/generic</span>
          </div>
          <p class="text-xs text-zinc-400">Send custom announcement or broadcast notification to single or multiple recipients.</p>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "to": ["student1@example.com", "student2@example.com"],
  "title": "Live Masterclass Rescheduled to 8:00 PM",
  "message": "Please note that today's live interactive session will start at 8:00 PM IST.",
  "actionText": "Join Masterclass",
  "actionUrl": "https://codekaro.in/live"
}</code></pre>
        </div>

      </div>
    </section>

    <!-- SECTION 3: ADMIN ENROLLMENT SUPPRESSION -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-medium uppercase tracking-wider">Feature #3</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Admin Enrollment Email Suppression</h2>
        <p class="text-zinc-400 text-sm">
          When creating manual enrollments via Admin Panel, include the optional <code>notifyUser</code> checkbox in your frontend form.
        </p>
      </div>

      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/v1/admin/enrollments</span>
          </div>
          <span class="text-xs text-amber-400 font-mono">Form Checkbox: "Send Email Notification to Student"</span>
        </div>
        
        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Payload Example (Suppress Email Notification):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "userId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "batchId": 12,
  "amountPaid": 0,
  "paymentStatus": "captured",
  "notifyUser": false
}</code></pre>
        </div>
        <p class="text-xs text-zinc-400">
          Setting <code>"notifyUser": false</code> will execute the DB transaction without queueing welcome or receipt emails. Default is <code>true</code>.
        </p>
      </div>
    </section>

    <!-- SECTION 4: AUDIT LOGS & HEALTH MONITORING -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-purple-400 font-medium uppercase tracking-wider">Feature #4</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Queue Audit Logs & SMTP Health UI</h2>
        <p class="text-zinc-400 text-sm">
          Endpoints for displaying queue delivery history and real-time transport health status in the Admin dashboard.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">GET</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/health</span>
          </div>
          <p class="text-xs text-zinc-400">Returns SMTP connection status and current mode (SMTP vs Mock/Dev).</p>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">GET</span>
            <span class="text-zinc-200 font-semibold">/v1/emails/audit-logs?limit=50</span>
          </div>
          <p class="text-xs text-zinc-400">Returns recent email delivery job logs (completed/failed/processing status).</p>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developer Documentation • Frontend Implementation Reference Guide
  </footer>
</body>
</html>`;
}
