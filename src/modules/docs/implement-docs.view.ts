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
        <a href="/docs/email-preview" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">Email Sandbox</a>
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
        Frontend Implementation & Migration Guide
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Codekaro API Implementation Guide</h1>
      <p class="text-zinc-400 text-base max-w-2xl">
        Complete step-by-step reference for frontend engineers implementing UUID data structures, 6-digit Email OTP passwordless login, and 30-day persistent session management.
      </p>
    </section>

    <!-- SECTION 1: CRITICAL UUID MIGRATION NOTICE -->
    <section class="space-y-6 pt-4 border-t border-zinc-900">
      <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 uppercase tracking-wider">🔥 Breaking Change</span>
            <h2 class="text-lg font-bold text-white tracking-tight">Database Primary & Foreign Keys Migrated to UUID</h2>
          </div>
          <span class="text-xs text-amber-400/80 font-mono">Effective Immediately</span>
        </div>
        <p class="text-zinc-300 text-sm leading-relaxed">
          All PostgreSQL primary keys (<code class="text-amber-300 font-mono">id</code>) and relation keys (<code class="text-amber-300 font-mono">batchId</code>, <code class="text-amber-300 font-mono">enrollmentId</code>, <code class="text-amber-300 font-mono">contentId</code>, <code class="text-amber-300 font-mono">sectionId</code>, <code class="text-amber-300 font-mono">batchContentId</code>) have been migrated from auto-increment integers to standard <strong>UUID v4 strings</strong> (e.g. <code class="text-indigo-400 font-mono">"f47ac10b-58cc-4372-a567-0e02b2c3d479"</code>).
        </p>

        <!-- Summary Table -->
        <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <table class="w-full text-left text-zinc-300">
            <thead>
              <tr class="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                <th class="pb-2 font-semibold">Entity</th>
                <th class="pb-2 font-semibold">Key Column(s)</th>
                <th class="pb-2 font-semibold">Legacy Type</th>
                <th class="pb-2 font-semibold text-emerald-400">New Type</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-zinc-900/60 text-xs">
              <tr>
                <td class="py-2 text-white font-medium">Batches</td>
                <td class="py-2 text-zinc-400">id</td>
                <td class="py-2 text-zinc-500">number (1, 2, 3)</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Batch Enrollments</td>
                <td class="py-2 text-zinc-400">id, batchId, userId</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Batch Sections</td>
                <td class="py-2 text-zinc-400">id, batchId</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Content Library</td>
                <td class="py-2 text-zinc-400">id</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Batch Content</td>
                <td class="py-2 text-zinc-400">id, batchId, sectionId, contentId</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Course Progress</td>
                <td class="py-2 text-zinc-400">id, enrollmentId, batchContentId</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
              <tr>
                <td class="py-2 text-white font-medium">Payments</td>
                <td class="py-2 text-zinc-400">id, batchEnrollmentId</td>
                <td class="py-2 text-zinc-500">number</td>
                <td class="py-2 text-emerald-400 font-bold">string (UUID)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Items for Frontend Engineers -->
        <div class="space-y-3 pt-2">
          <h3 class="text-sm font-semibold text-white tracking-tight">Required Frontend Action Checklist:</h3>
          <ul class="space-y-2 text-xs text-zinc-300">
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-mono font-bold">1.</span>
              <span><strong>Update TypeScript Types & Interfaces</strong>: Change all <code class="text-amber-300 font-mono">id: number</code> properties to <code class="text-emerald-400 font-mono">id: string</code>.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-mono font-bold">2.</span>
              <span><strong>Route Parameter Parsing</strong>: Do NOT use <code class="text-amber-300 font-mono">parseInt(params.id, 10)</code> or <code class="text-amber-300 font-mono">Number(params.id)</code> on URL route parameters like <code class="text-zinc-400 font-mono">/courses/:batchId</code>. Pass string parameters directly.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-mono font-bold">3.</span>
              <span><strong>JSON Request Payloads</strong>: Send string UUID values for <code class="text-indigo-300 font-mono">batchId</code>, <code class="text-indigo-300 font-mono">enrollmentId</code>, <code class="text-indigo-300 font-mono">batchContentId</code> in POST/PUT API bodies.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-400 font-mono font-bold">4.</span>
              <span><strong>Clear Legacy Local Cache</strong>: Clear any <code class="text-zinc-400 font-mono">localStorage</code> or state cache storing numeric IDs to avoid stale ID mismatches.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- SECTION: CODE COMPARISON -->
    <section class="space-y-6 pt-4 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-indigo-400 font-medium uppercase tracking-wider">Code Snippet Reference</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">TypeScript Interface & API Usage Comparison</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Legacy / Before -->
        <div class="bg-zinc-900/40 border border-red-900/40 rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 text-xs font-mono text-red-400 font-semibold uppercase">
            <span>❌ Legacy (Incorrect)</span>
          </div>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-red-300/80 border border-zinc-800/60 overflow-x-auto"><code>// DEPRECATED TYPES
interface Batch {
  id: number; // ❌ Integer ID
  name: string;
}

// ❌ WRONG ROUTE PARSING
const batchId = parseInt(params.id, 10);

// ❌ WRONG REQUEST BODY
await fetch('/v1/payments/razorpay/create-order', {
  body: JSON.stringify({
    batchId: 4, // ❌ Number
    paymentType: "enrollment"
  })
});</code></pre>
        </div>

        <!-- Updated / After -->
        <div class="bg-zinc-900/40 border border-emerald-900/40 rounded-xl p-5 space-y-3">
          <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
            <span>✅ Updated (Correct)</span>
          </div>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-300 border border-zinc-800/60 overflow-x-auto"><code>// UPDATED TYPES
interface Batch {
  id: string; // ✅ UUID string
  name: string;
}

// ✅ CORRECT ROUTE PARSING
const batchId = params.id; // String directly

// ✅ CORRECT REQUEST BODY
await fetch('/v1/payments/razorpay/create-order', {
  body: JSON.stringify({
    batchId: "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
    paymentType: "enrollment"
  })
});</code></pre>
        </div>
      </div>
    </section>

    <!-- SECTION: AUTHENTICATION WORKFLOW OVERVIEW -->
    <section class="border border-zinc-900 bg-zinc-900/30 rounded-xl p-6 space-y-4 pt-6">
      <h3 class="text-sm font-mono text-indigo-400 font-semibold uppercase tracking-wider">Authentication Workflow Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs font-mono">
        <div class="bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg space-y-1">
          <div class="text-indigo-400 font-bold">1. REQUEST OTP</div>
          <p class="text-zinc-500 text-[11px]">User enters email. API sends 10-min 6-digit OTP code.</p>
        </div>
        <div class="bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg space-y-1">
          <div class="text-emerald-400 font-bold">2. ENTER 6 DIGITS</div>
          <p class="text-zinc-500 text-[11px]">Student enters code into input fields (e.g. 482910).</p>
        </div>
        <div class="bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg space-y-1">
          <div class="text-purple-400 font-bold">3. VERIFY CODE</div>
          <p class="text-zinc-500 text-[11px]">Better Auth verifies OTP & sets 30-day session cookie.</p>
        </div>
        <div class="bg-zinc-900/70 border border-zinc-800 p-4 rounded-lg space-y-1">
          <div class="text-amber-400 font-bold">4. AUTHENTICATED</div>
          <p class="text-zinc-500 text-[11px]">User stays logged in for next 30 days seamlessly.</p>
        </div>
      </div>
    </section>

    <!-- SECTION: EMAIL OTP WORKFLOW -->
    <section class="space-y-6 pt-4 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Primary Authentication</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">6-Digit Email OTP Login Flow</h2>
        <p class="text-zinc-400 text-sm">
          Send a 6-digit one-time passcode to the student's email. Reliable across all mobile devices and web browsers.
        </p>
      </div>

      <!-- Step 1: Send OTP -->
      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/api/auth/email-otp/send-verification-otp</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Public Endpoint</span>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Request Payload:</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "email": "student@example.com",
  "type": "sign-in"
}</code></pre>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Response (200 OK):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": true,
  "message": "OTP code sent to student@example.com"
}</code></pre>
        </div>
      </div>

      <!-- Step 2: Verify OTP -->
      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/api/auth/email-otp/verify-email</span>
          </div>
          <span class="text-xs text-emerald-400 font-mono">Sets 30-Day Cookie: better-auth.session_token</span>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Request Payload:</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "email": "student@example.com",
  "otp": "482910"
}</code></pre>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Response (200 OK):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "user": {
    "id": "30959dbb-bc3c-4cbc-936b-bcacaa1989d7",
    "email": "student@example.com",
    "name": "Rahul Sharma",
    "role": "student",
    "avatarUrl": null,
    "mobile": "+919876543210"
  },
  "session": {
    "id": "sess_89102834",
    "token": "XPjhBWHgLTDmpJZCl0RLlnAzUoXHAsCg",
    "expiresAt": "2026-08-20T04:15:47.897Z"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- STEP: GET CURRENT USER SESSION -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-purple-400 font-medium uppercase tracking-wider">Session Check</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Fetch Current Authenticated Session</h2>
        <p class="text-zinc-400 text-sm">
          Call this on app startup or page load to check if the user has an active 30-day session.
        </p>
      </div>

      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">GET</span>
            <span class="text-zinc-200 font-semibold">/api/auth/get-session</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Guarantees 200 OK with null session when unauthenticated</span>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Response (200 OK):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "user": {
    "id": "30959dbb-bc3c-4cbc-936b-bcacaa1989d7",
    "email": "student@example.com",
    "name": "Rahul Sharma",
    "role": "student",
    "avatarUrl": null,
    "mobile": "+919876543210"
  },
  "session": {
    "id": "sess_89102834",
    "token": "XPjhBWHgLTDmpJZCl0RLlnAzUoXHAsCg",
    "expiresAt": "2026-08-20T04:15:47.897Z"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- STEP: SIGN OUT -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-amber-400 font-medium uppercase tracking-wider">Sign Out</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Sign Out & Clear Session</h2>
        <p class="text-zinc-400 text-sm">
          Call this when the user clicks the "Sign Out" button in your UI to invalidate their active 30-day session.
        </p>
      </div>

      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/api/auth/sign-out</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Invalidates Active Session</span>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Response (200 OK):</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "success": true,
  "message": "Logged out successfully"
}</code></pre>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developer Documentation • Implementation Guide
  </footer>
</body>
</html>`;
}
