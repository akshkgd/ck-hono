export function getImplementDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Better Auth OTP & Magic Link Implementation Guide - Codekaro Dev Docs</title>
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
        Better Auth OTP & Magic Link Reference
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Email 6-Digit OTP & 30-Day Session Guide</h1>
      <p class="text-zinc-400 text-base max-w-2xl">
        Complete step-by-step reference for frontend engineers implementing 6-digit Email OTP login, Magic Links, and 30-day persistent session management using Better Auth.
      </p>
    </section>

    <!-- Flow Diagram Card -->
    <section class="border border-zinc-900 bg-zinc-900/30 rounded-xl p-6 space-y-4">
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
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Option A (Recommended)</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">6-Digit Email OTP Login Flow</h2>
        <p class="text-zinc-400 text-sm">
          Send a 6-digit one-time passcode to the student's email. Extremely reliable on all mobile devices and web browsers.
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

    <!-- SECTION: MAGIC LINK WORKFLOW -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-indigo-400 font-medium uppercase tracking-wider">Option B</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">1-Click Magic Link Login Flow</h2>
        <p class="text-zinc-400 text-sm">
          Send a 1-click login button to the student's inbox.
        </p>
      </div>

      <!-- Request Magic Link -->
      <div class="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2 font-mono text-sm">
            <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">POST</span>
            <span class="text-zinc-200 font-semibold">/api/auth/sign-in/magic-link</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Public Endpoint</span>
        </div>

        <div>
          <span class="text-xs text-zinc-400 font-mono block mb-1">Request Payload:</span>
          <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "email": "student@example.com",
  "callbackURL": "https://app.codekaro.in/verify-magic-link"
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
    Codekaro Developer Documentation • Better Auth OTP & Magic Link Integration Guide
  </footer>
</body>
</html>`;
}
