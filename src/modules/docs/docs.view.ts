export function getDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codekaro API Reference Manual</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
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
    body {
      font-family: 'Inter', sans-serif;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #09090b;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #27272a;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #3f3f46;
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-200 antialiased min-h-screen flex font-normal custom-scrollbar">

  <!-- Left Sidebar Navigation (Tree structure) -->
  <aside class="w-80 border-r border-zinc-900 bg-zinc-950 fixed h-screen overflow-y-auto hidden lg:flex flex-col justify-between custom-scrollbar z-20">
    <div class="p-6">
      <div class="flex items-center space-x-2.5 mb-8">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs</span>
      </div>
      
      <nav class="space-y-6">
        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Getting Started</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li><a href="#overview" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Overview</a></li>
            <li><a href="#auth-session" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Auth & Sessions</a></li>
            <li><a href="#error-handling" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Error System</a></li>
            <li><a href="#typescript-types" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">TS Type Guides</a></li>
          </ul>
        </div>
        
        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Authentication</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-register" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Register</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-login" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Login</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#endpoint-me" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get profile</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-logout" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Logout</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Users</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#users-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List users</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#users-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create user</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-amber-500/10 text-amber-400 font-mono">PUT</span>
              <a href="#users-update" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update user</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#users-details" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">User details</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Batches & Sections</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#batches-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Search batches</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#batches-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create batch</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#batches-sections" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create section</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Enrollments</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#enrollments-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List enrollments</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#enrollments-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Enroll student</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#payments-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List payments</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Diagnostics</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#endpoint-system-logs" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Read system logs</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    
    <div class="p-6 border-t border-zinc-900">
      <a href="/playground" class="block text-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs py-2 rounded font-normal transition-all shadow-sm">
        Go to Playground &rarr;
      </a>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 lg:pl-80 flex flex-col min-h-screen">
    
    <!-- Header -->
    <header class="h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-8 fixed top-0 right-0 left-0 lg:left-80 z-10">
      <div class="flex items-center space-x-4">
        <h2 class="text-zinc-100 text-sm font-normal font-mono select-none">API Integration Reference</h2>
      </div>
      <div class="flex items-center gap-4">
        <a href="/playground" class="text-indigo-400 hover:text-indigo-300 text-sm transition font-normal font-mono">
          Playground &rarr;
        </a>
      </div>
    </header>

    <!-- Main Body Sections -->
    <main class="flex-1 p-6 md:p-10 w-full mx-auto space-y-24 mt-16 pb-24">
      
      <!-- Section: Overview -->
      <section id="overview" class="scroll-mt-24 space-y-4 max-w-4xl">
        <h1 class="text-3xl font-normal text-zinc-50 font-mono tracking-tight">API Integration Overview</h1>
        <p class="text-zinc-400 text-sm leading-relaxed">
          Welcome to the Codekaro Integration Manual. This document provides core specifications, schemas, error formats, and architectural best practices required for Senior Frontend Engineers to integrate, state-manage, and compile the client web or mobile application securely at scale.
        </p>
        <div class="bg-zinc-900/50 border border-zinc-900 rounded-lg p-5 text-sm font-mono max-w-xl space-y-1">
          <span class="text-zinc-500 font-normal">Base API endpoint:</span>
          <div class="text-zinc-200">https://live.codekaro.in/v1</div>
        </div>
      </section>

      <!-- Section: Auth & Sessions -->
      <section id="auth-session" class="scroll-mt-24 space-y-6 max-w-4xl">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Authentication & Session Architecture</h2>
        </div>
        <p class="text-zinc-400 text-sm leading-relaxed">
          The system uses stateless, short-lived **JWT Access Tokens** for request authentication, combined with a **Redis refresh token** schema stored server-side to allow revocation and immediate logout.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div class="space-y-4">
            <h3 class="text-sm font-normal uppercase text-zinc-400 tracking-wider font-mono">Access Token Handling</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              When logging in successfully, the API returns a JWT token. Store this token inside **localStorage** (or secure memory storage) and pass it in all authenticated requests inside the header:
            </p>
            <pre class="bg-zinc-900/50 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300"><code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code></pre>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-normal uppercase text-zinc-400 tracking-wider font-mono">Expired Session Handling (401)</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Any request made with an expired token or missing session key in Redis returns a **401 Unauthorized** HTTP code. Your client API wrapper (e.g. Axios Interceptors) must catch 401 statuses globally and redirect the user back to the login route, clearing any cached states.
            </p>
          </div>
        </div>
      </section>

      <!-- Section: Error Handling -->
      <section id="error-handling" class="scroll-mt-24 space-y-6 max-w-4xl">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Error System & Responses</h2>
        </div>
        <p class="text-zinc-400 text-sm leading-relaxed">
          All endpoints respond with consistent, structured JSON objects. Use these formats to bind client-side notifications or validation fields cleanly.
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div class="space-y-3">
            <h3 class="text-sm font-normal uppercase text-zinc-400 tracking-wider font-mono">Standard Error (500, 403, 401)</h3>
            <pre class="bg-zinc-900/50 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300"><code>{
  "status": "error",
  "message": "Detailed error explanation here",
  "requestId": "optional-uuid-string"
}</code></pre>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-normal uppercase text-zinc-400 tracking-wider font-mono">Zod Field Validation Errors (400)</h3>
            <pre class="bg-zinc-900/50 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300"><code>{
  "success": false,
  "error": {
    "name": "ZodError",
    "message": [
      {
        "path": ["email"],
        "message": "Invalid email address"
      }
    ]
  }
}</code></pre>
          </div>
        </div>
      </section>

      <!-- Section: TypeScript Type Guides -->
      <section id="typescript-types" class="scroll-mt-24 space-y-6 max-w-4xl">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">TypeScript Types & Interfaces</h2>
        </div>
        <p class="text-zinc-400 text-sm leading-relaxed">
          Import or copy these typed TypeScript interfaces to maintain full type-safety inside your frontend state management store (e.g. Redux Toolkit, Zustand, Pinia).
        </p>

        <pre class="bg-zinc-900/50 border border-zinc-900 p-5 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>export interface User {
  id: string;
  email: string;
  name: string | null;
  mobile: string | null;
  role: 'student' | 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  xp: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Batch {
  id: number;
  name: string;
  topic: string | null;
  price: number | null;
  type: 'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship';
  startDate: string;
  endDate: string;
  status: 'active' | 'private' | 'completed';
}

export interface BatchEnrollment {
  id: number;
  userId: string;
  batchId: number;
  amountPayable: number | null;
  enrollmentType: 'oneTime' | 'Subscription' | 'free';
  status: number;
  progress: number;
  timeSpentSeconds: number;
  paymentStatus: 'captured' | 'failed' | 'created' | 'refunded';
}</code></pre>
      </section>

      <!-- REST API Endpoint Specifications (3-column layout) -->
      <section class="space-y-24 border-t border-zinc-900 pt-16">
        <div class="max-w-4xl">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">REST API Endpoints</h2>
          <p class="text-zinc-400 text-sm mt-2">Exhaustive documentation for frontend integration. Code blocks display requests and JSON responses in parallel.</p>
        </div>

        <!-- -------------------- AUTHENTICATION GROUP -------------------- -->

        <!-- Endpoint: POST /auth/register -->
        <div id="endpoint-register" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <!-- Left/Middle Panel: Specs & Details -->
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Register account</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Creates a new student account record in the database. Defaults to role 'student' and status 'active'.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/register</span>
            </div>
            
            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Request Headers</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Name</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">Content-Type</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 text-zinc-400">Must be 'application/json'</td></tr>
                </tbody>
              </table>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs font-sans border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody class="font-sans">
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">email</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Valid email format.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">password</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Minimum 6 characters.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">name</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Minimum 2 characters.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right Panel: Code Blocks & Responses -->
          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'SecurePassword123!',
    name: 'Jane Doe'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (201 Created)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "user": {
      "id": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
      "email": "student@example.com",
      "name": "Jane Doe",
      "role": "student",
      "status": "active"
    }
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /auth/login -->
        <div id="endpoint-login" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Login to account</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Verifies email and password, creates a unique session block in Redis, and returns the JWT Bearer Token.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/login</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs font-sans border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">email</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Your account email.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">password</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Your password.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'student@example.com',
    password: 'SecurePassword123!'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
      "email": "student@example.com",
      "name": "Jane Doe",
      "role": "student"
    }
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /auth/me -->
        <div id="endpoint-me" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get Profile details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Returns profile fields of the currently logged-in user. Requires valid JWT Token.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/auth/me</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Authorization Headers</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Header</th><th class="p-2 border-r border-zinc-900">Value</th><th class="p-2">Required</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">Authorization</td><td class="p-2 border-r border-zinc-900 text-zinc-400">Bearer &lt;JWT_TOKEN&gt;</td><td class="p-2 text-indigo-400">Yes</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "user": {
      "id": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
      "email": "student@example.com",
      "name": "Jane Doe",
      "role": "student",
      "status": "active"
    }
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /auth/logout -->
        <div id="endpoint-logout" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Logout user</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Removes the session block identifier from Redis, rendering the JWT token invalid for future requests.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/logout</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "message": "Logout successful"
}</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: USERS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/users -->
        <div id="users-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List and Search Users</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Query registered user records with paginated limits and optional keyword match on name, email, or mobile prefixes. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/users</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Query Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Default</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">""</td><td class="p-2 text-zinc-400">Prefix filter matching name or email.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">limit</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">10</td><td class="p-2 text-zinc-400">Max size (1 to 50).</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">page</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">1</td><td class="p-2 text-zinc-400">Offset multiplier.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/users?q=Aarav&limit=10&page=1', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "a908a8f1-c4d3-4673-982c-47ea1fb1f2c2",
        "email": "aarav.sharma@example.com",
        "name": "Aarav Sharma",
        "role": "student",
        "status": "active"
      }
    ],
    "pagination": { "page": 1, "limit": 10 }
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/users -->
        <div id="users-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create new user</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Forces creation of a new user account profile from the admin interface. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/users</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">email</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Valid email format.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">password</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Min 6 characters.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">name</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Min 2 characters.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">role</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'student', 'admin', 'user', 'moderator'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'active', 'inactive', 'suspended'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    email: 'staff.moderator@example.com',
    password: 'SecurePassword77!',
    name: 'Staff Moderator',
    role: 'moderator',
    status: 'active'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (201 Created)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "message": "User added successfully",
  "data": {
    "id": "c902b4d1-c221-4fb2-b7e1-88ffae28d9c2",
    "email": "staff.moderator@example.com",
    "name": "Staff Moderator",
    "role": "moderator",
    "status": "active"
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/users/:id -->
        <div id="users-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update User Profile</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates specific details for the user record matching the UUID in the URL path. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">PUT</span>
              <span class="text-zinc-200">/v1/admin/users/:id</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Unique identifier of the target user.</td></tr>
                </tbody>
              </table>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON - Optional/Partial)</div>
              <p class="text-xs text-zinc-500">Modify select fields such as name, bio, experienceYears, occupationType, organization, xp, or metadata.</p>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/users/8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    name: 'Jane Smith Updated',
    bio: 'Professional Software Engineer',
    experienceYears: 4
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
    "name": "Jane Smith Updated",
    "bio": "Professional Software Engineer",
    "experienceYears": 4,
    "email": "student@example.com",
    "role": "student"
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /admin/users/:id/details -->
        <div id="users-details" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get User Profile Details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Fetches comprehensive user details including profile info, course enrollments history, progress percentages, and active device login session objects parsed from Redis. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/users/:id/details</span>
            </div>
            
            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">UUID identifier of the student.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/users/8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1/details', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "user": {
      "id": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
      "email": "student@example.com",
      "name": "Jane Doe",
      "role": "student",
      "status": "active"
    },
    "enrollments": [
      {
        "id": 1,
        "batchId": 4,
        "batchName": "Full-Stack Web Cohort",
        "progress": 75,
        "timeSpentSeconds": 14400,
        "paymentStatus": "captured"
      }
    ],
    "activeSessions": [
      {
        "sessionId": "4b68ca90-8c2d-4dc0-891a-ddfe515bf7ed",
        "ipAddress": "127.0.0.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2026-06-28T12:00:00.000Z"
      }
    ]
  }
}</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: BATCHES GROUP -------------------- -->

        <!-- Endpoint: GET /admin/batches -->
        <div id="batches-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List and Filter Batches</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Searches course cohorts, webinars, and bookings using filters. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/batches</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Query Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 text-zinc-400">Filter matches name or topic prefixes.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">type</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 text-zinc-400">'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 text-zinc-400">'active' | 'private' | 'completed'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/batches?type=cohort&status=active', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/batches -->
        <div id="batches-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create new batch course</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Creates a new batch course cohort. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/batches</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">name</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch identifier name.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">startDate</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">YYYY-MM-DD format.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">endDate</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">YYYY-MM-DD format.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">price</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Base course fee amount.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/batches', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    name: 'Next.js Frontend Engineering',
    startDate: '2026-07-01',
    endDate: '2026-09-01',
    price: 2499,
    type: 'cohort',
    status: 'active'
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/batch-sections -->
        <div id="batches-sections" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create batch section</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Adds a curriculum segment section header under a batch course. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/batch-sections</span>
            </div>
            
            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">title</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Title of the section header.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">ID of the cohort mapping.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">order</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Sort priority numbering.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/batch-sections', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    title: 'Introduction to React Frameworks',
    batchId: 4,
    order: 1
  })
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: ENROLLMENTS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/enrollments -->
        <div id="enrollments-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List Student Enrollments</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Searches active registrations and progresses. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollments</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/enrollments?limit=10', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/enrollments -->
        <div id="enrollments-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Enroll student in batch</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Directly registers a student inside a course batch cohort. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/enrollments</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">userId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Target User UUID.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Target batch numerical ID.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">amountPayable</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Agreed price amount.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">enrollmentType</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'oneTime' | 'Subscription' | 'free'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/enrollments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    userId: '8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1',
    batchId: 4,
    amountPayable: 1999,
    enrollmentType: 'oneTime'
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /admin/enrollment-payments -->
        <div id="payments-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List payment transactions</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Queries invoice transaction audits in the database. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/enrollment-payments', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- SYSTEM DIAGNOSTICS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/logs -->
        <div id="endpoint-system-logs" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Diagnostics</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Fetch System Logs</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Reads real-time rotating structured logging entries from disk storage. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/logs/data</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Query Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">file</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Log file name (e.g. 'app-2026-06-28.log').</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">level</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'all' | 'error' | 'warning' | 'info' | 'debug'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://live.codekaro.in/v1/admin/logs/data?file=app-2026-06-28.log&level=error', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

      </section>

    </main>
  </div>
</body>
</html>`;
}
