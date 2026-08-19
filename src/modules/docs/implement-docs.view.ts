export function getImplementDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Implementation Guide - Codekaro Dev Docs</title>
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
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs / integration</span>
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
        New Features Integration Guide
      </div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Feature Implementation Guide</h1>
      <p class="text-zinc-400 text-base max-w-2xl">
        Developer reference for integrating the <strong>Bug Reporting & Tracking System</strong> and <strong>Live Session Attendance / Recorded Batches</strong> on the Codekaro client applications.
      </p>
    </section>

    <!-- SECTION 1: BUG REPORTING & TRACKING SYSTEM -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Module 1</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Bug Reporting & Tracking System</h2>
        <p class="text-zinc-400 text-sm">
          Allows students to submit bugs with rich contextual logs (URL where the error happened, device parameters, and steps to reproduce). Admins can filter, monitor, update status, and track them to resolution.
        </p>
      </div>

      <!-- Student reporting -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">Student Endpoints</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Authorization Cookie</span>
        </div>

        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-white">1. Report a Bug</h3>
          <p class="text-zinc-400 text-xs font-mono">POST /v1/student/bugs</p>
          <div>
            <span class="text-[11px] text-zinc-500 font-mono block mb-1">JSON Payload:</span>
            <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "description": "The video player fails to enter full-screen mode on Safari.",
  "severity": "medium", // 'low' | 'medium' | 'high' | 'critical'
  "url": "https://app.codekaro.in/courses/batch-123/video-player", // The exact window.location.href where error occurred
  "deviceInfo": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "viewport": "1440x900",
    "language": "en-US"
  },
  "screenshotUrl": null // Optional URL of uploaded image
}</code></pre>
          </div>
        </div>
      </div>

      <!-- Admin tracking -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/20">Admin Endpoints</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Admin Authorization</span>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white">1. Search & Filter Bug Reports</h3>
            <p class="text-zinc-400 text-xs font-mono">GET /v1/admin/bugs?page=1&limit=20&status=pending&severity=high&q=player</p>
            <p class="text-xs text-zinc-400">Allows searching by submitter name/email or bug description, and filtering by severity or status.</p>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">2. Update Bug Status / Severity / Remarks</h3>
            <p class="text-zinc-400 text-xs font-mono">PUT /v1/admin/bugs/:id</p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">JSON Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": "resolved", // 'pending' | 'investigating' | 'resolved' | 'closed'
  "severity": "high", // 'low' | 'medium' | 'high' | 'critical'
  "remarks": "Investigated and fixed Safari full-screen handler in JS bundle v2.1.4"
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">3. Delete Bug Report</h3>
            <p class="text-zinc-400 text-xs font-mono">DELETE /v1/admin/bugs/:id</p>
            <p class="text-xs text-zinc-400">Removes the bug report permanently from the tracking console.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 2: LIVE SESSIONS & ATTENDANCE TRACKING -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Module 2</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Live Sessions & Attendance Tracking</h2>
        <p class="text-zinc-400 text-sm">
          Enables creation of structured live class sessions inside specific course sections, records detailed joining/leaving timestamps for student attendance calculations, and supports <strong>Recorded</strong> courses.
        </p>
      </div>

      <!-- Recorded Batch UI Logic -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-3">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 uppercase tracking-wider">UI Checklist</span>
          <h3 class="text-sm font-bold text-white">Recorded Course Display Adaptation</h3>
        </div>
        <p class="text-zinc-300 text-xs leading-relaxed">
          If <code class="text-indigo-400 font-mono">batch.type === 'recorded'</code>, the frontend must dynamically hide cohort-specific elements like live scheduler sections, calendar links, and real-time broadcast headers. It should render the sections as self-paced modules of pre-recorded videos, assignments, and reading materials instead.
        </p>
      </div>

      <!-- Student APIs -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">Student & Learner Endpoints</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Authorization Cookie</span>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-white">1. Course Details & Curriculum API (Automatic Inline Embedding)</h3>
            <p class="text-zinc-400 text-xs font-mono">GET /v1/student/courses/:batchId</p>
            <p class="text-xs text-zinc-300 leading-relaxed">
              <strong>No Frontend Changes Required:</strong> For <code class="text-indigo-400 font-mono">live</code> and <code class="text-indigo-400 font-mono">cohort</code> course types, the main learner API fetches all live sessions for the course and automatically merges them directly into the respective curriculum sections.
            </p>
            <p class="text-xs text-zinc-400 leading-relaxed mt-1">
              Inside each section's <code class="text-indigo-300 font-mono">contents</code> array, they appear with <code class="text-emerald-400 font-mono">"type": "live_session"</code> and are sorted by order. The live session details (topic, desc, time, recording links) are populated in the <code class="text-indigo-300 font-mono">content</code> sub-object.
            </p>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">2. Fetch Dedicated Live Sessions list with Attendance Logs</h3>
            <p class="text-zinc-400 text-xs font-mono">GET /v1/student/batches/:batchId/live-sessions</p>
            <p class="text-xs text-zinc-400">Fetches all scheduled sessions, automatically merging student participation records to show if they attended, along with duration metrics.</p>
          </div>
        </div>
      </div>

      <!-- Admin APIs -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/20">Admin Endpoints</span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white">1. Create a Live Session (Linked to Batch Section)</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/batches/:batchId/live-sessions</p>
            <p class="text-xs text-zinc-300">
              To place a live session inside a specific curriculum section, provide the section's UUID in the <code class="text-indigo-400 font-mono">sectionId</code> field. If omitted, the session is placed in the unassigned content area.
            </p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">JSON Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "topic": "Introduction to Hono and Router Architecture",
  "desc": "Deep dive into web request handling and route patterns.",
  "time": "2026-08-01T15:00:00.000Z", // Scheduled ISO date/time string
  "sectionId": "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d", // Links the live session to this specific section ID
  "screenHlsVideo": null,
  "faceHlsVideo": null,
  "recordingHls": null,
  "order": 1 // Determines placement order within the section
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">2. Record Session Join / Leave Attendance Events</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/live-sessions/attendance</p>
            <p class="text-xs text-zinc-400 mb-2">Typically called automatically when a student enters the live classroom interface ("joined") or when they disconnect / leave the tab ("left").</p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Join Event Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "email": "student@example.com",
  "liveSessionId": "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
  "status": "joined"
}</code></pre>
            </div>
            <div class="mt-2">
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Leave Event Payload (Requires durationSeconds calculation):</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-amber-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "email": "student@example.com",
  "liveSessionId": "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
  "status": "left",
  "durationSeconds": 1800 // Time spent in the session in seconds
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">3. Unlock All Assignments of a Batch</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/batches/:id/unlock-assignments</p>
            <p class="text-xs text-zinc-400 mb-2">
              Unlocks all assignment submission forms for all existing enrolled students of a specific batch in one shot. This is primarily used as a utility to allow legacy/cohort students to skip watch time verification requirements for past content.
            </p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Response JSON:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": "success",
  "message": "Successfully unlocked all assignments for existing learners in this batch (Updated/created 15 progress records)",
  "data": {
    "unlockedCount": 15
  }
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">4. Reset Access Till limit for All Batch Contents</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/batch-contents/reset-access-till</p>
            <p class="text-xs text-zinc-400 mb-2">
              Resets the <code class="text-indigo-400 font-mono">accessTill</code> value to <code class="text-indigo-400 font-mono">0</code> for all existing batch content records in one shot. This is a one-time administrative action.
            </p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Response JSON:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": "success",
  "message": "Successfully reset accessTill to 0 for all batch contents (Updated 42 records)",
  "data": {
    "updatedCount": 42
  }
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">5. Bulk Update Course Progress for a Student</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/course-progress/bulk-update</p>
            <p class="text-xs text-zinc-400 mb-2">
              Updates course progress, watch minutes, GitHub links, and deployment links for multiple batch content items for a specific student. Wraps all updates and parent enrollment progress recalculation inside a single database transaction. Auto-completes chapters if watch minutes match or exceed 75% of the video duration.
            </p>
            <div>
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Request Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "userId": "989c5a03-dbb7-49ab-ac19-1a6156b83ea1",
  "batchId": "768bc964-7c8e-4fd7-8dd0-0a328e9f82d4",
  "items": [
    {
      "batchContentId": "d1a8c8e9-5f2b-4e3a-8b1c-9d0e1f2a3b4c",
      "watchMinutes": 45,
      "githubLink": "https://github.com/username/repo",
      "deployedLink": "https://my-app.vercel.app",
      "completed": true
    }
  ]
}</code></pre>
            </div>
            <div class="mt-2">
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Response JSON:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": "success",
  "message": "Successfully updated progress for 1 chapters",
  "data": {
    "updatedCount": 1
  }
}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: BATCH RENEWAL & RENEWAL FEE SYSTEM -->
    <section class="space-y-6 pt-6 border-t border-zinc-900">
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium uppercase tracking-wider">Module 3</div>
        <h2 class="text-2xl font-bold text-white tracking-tight">Batch Renewal Fee & Renewal Checkout System</h2>
        <p class="text-zinc-400 text-sm">
          Allows admins to specify a custom renewal fee for course batches. When students renew their enrollment, the checkout engine automatically applies the custom <code class="text-indigo-400 font-mono">renewalFee</code> if configured, or falls back to the standard course <code class="text-indigo-400 font-mono">price</code> when left blank.
        </p>
      </div>

      <!-- Admin Batch API Updates -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-semibold border border-indigo-500/20">Admin Endpoints</span>
          </div>
          <span class="text-xs text-zinc-500 font-mono">Requires Admin Authorization</span>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white">1. Create or Update Batch with Renewal Fee</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/admin/batches &nbsp;|&nbsp; PUT /v1/admin/batches/:id</p>
            <p class="text-xs text-zinc-400">Pass <code class="text-indigo-300 font-mono">renewalFee</code> as an integer representing the amount in INR (rupees). Set to <code class="text-zinc-400 font-mono">null</code> or omit to leave blank.</p>
            <div class="mt-2">
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">JSON Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "name": "Fullstack Web Development Cohort",
  "topic": "Web Development",
  "slug": "fullstack-web-dev",
  "price": 4999,
  "renewalFee": 1999, // Renewal fee in rupees (or null to fallback to price)
  "type": "cohort",
  "status": "active"
}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Public Batch & Checkout APIs -->
      <div class="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/20">Public & Student Endpoints</span>
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-sm font-semibold text-white">1. Fetch Public Batch Details</h3>
            <p class="text-zinc-400 text-xs font-mono">GET /v1/batches/:id &nbsp;|&nbsp; GET /v1/batches/slug/:slug</p>
            <p class="text-xs text-zinc-400">Public batch responses include <code class="text-indigo-300 font-mono">renewalFee</code> so frontend client apps can render renewal prices on course detail or account renewal pages.</p>
            <div class="mt-2">
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Response JSON Excerpt:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-indigo-300 border border-zinc-800/60 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": "768bc964-7c8e-4fd7-8dd0-0a328e9f82d4",
    "name": "Fullstack Web Development Cohort",
    "price": 4999,
    "renewalFee": 1999,
    "slug": "fullstack-web-dev"
  }
}</code></pre>
            </div>
          </div>

          <div class="space-y-1 border-t border-zinc-900 pt-3">
            <h3 class="text-sm font-semibold text-white">2. Renewal Checkout Order Creation</h3>
            <p class="text-zinc-400 text-xs font-mono">POST /v1/payments/razorpay/create-order</p>
            <p class="text-xs text-zinc-400">When initiating a course renewal order, set <code class="text-indigo-300 font-mono">paymentType</code> to <code class="text-emerald-400 font-mono">"renew"</code> and pass the student's existing <code class="text-indigo-300 font-mono">enrollmentId</code>.</p>
            <div class="mt-2">
              <span class="text-[11px] text-zinc-500 font-mono block mb-1">Renewal Order Request Payload:</span>
              <pre class="bg-zinc-950 p-4 rounded-lg text-xs font-mono text-emerald-400 border border-zinc-800/60 overflow-x-auto"><code>{
  "paymentType": "renew",
  "enrollmentId": "c3a1b2c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c"
}</code></pre>
            </div>
            <div class="mt-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3 text-xs text-indigo-300 leading-relaxed">
              💡 <strong class="text-white">Fee Evaluation Order:</strong>
              If <code class="text-indigo-200 font-mono">batch.renewalFee</code> is configured (e.g. 1999), the Razorpay order amount will be 1999 INR (199900 paise). If <code class="text-indigo-200 font-mono">batch.renewalFee</code> is <code class="text-zinc-400 font-mono">null</code> or blank, it automatically falls back to charging <code class="text-indigo-200 font-mono">batch.price</code> (4999 INR).
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developer Documentation • Integration Guide
  </footer>
</body>
</html>`;
}

