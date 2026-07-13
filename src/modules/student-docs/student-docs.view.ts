export function getStudentDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codekaro Student API Reference Manual</title>
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
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">student docs</span>
      </div>
      
      <nav class="space-y-6">
        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Getting Started</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li><a href="#overview" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Overview</a></li>
            <li><a href="#auth-session" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Auth & Sessions</a></li>
            <li><a href="#error-handling" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">Error System</a></li>
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
              <a href="#endpoint-refresh" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Refresh Session</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-logout" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Logout</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Student Dashboard</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#endpoint-student-courses" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Enrolled Courses</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#endpoint-student-course-details" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Course Details</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#endpoint-student-content-access" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Content Access Check</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-student-progress-log" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update Progress Heartbeat</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#endpoint-student-submit-assignment" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Submit Assignment</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Student: Course Progress</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#progress-upsert" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update progress</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#progress-get-batch" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get batch progress</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 lg:pl-80 flex flex-col min-h-screen">
    
    <!-- Header -->
    <header class="h-16 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur flex items-center justify-between px-8 fixed top-0 right-0 left-0 lg:left-80 z-10">
      <div class="flex items-center space-x-4">
        <h2 class="text-zinc-100 text-sm font-normal font-mono select-none">Student API Reference Portal</h2>
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
        <h1 class="text-3xl font-normal text-zinc-50 font-mono tracking-tight">Student API Integration Overview</h1>
        <p class="text-zinc-400 text-sm leading-relaxed">
          Welcome to the Student Dashboard Integration Reference Manual. This document provides core specifications, schemas, error formats, and endpoint details required to build secure, robust, and state-managed student-facing layouts.
        </p>
        <div class="bg-zinc-900/50 border border-zinc-900 rounded-lg p-5 text-sm font-mono max-w-xl space-y-1">
          <span class="text-zinc-500 font-normal">Base API endpoint:</span>
          <div class="text-zinc-200">https://api.codekaro.in/v1</div>
        </div>
      </section>

      <!-- Section: Auth & Sessions -->
      <section id="auth-session" class="scroll-mt-24 space-y-6 max-w-4xl">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Authentication & Session Architecture</h2>
        </div>
        <p class="text-zinc-400 text-sm leading-relaxed">
          Student endpoints are authenticated using a dual-compatible architecture:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-zinc-400 text-sm">
          <li><strong>HttpOnly Cookie (Preferred)</strong>: Deliver and read JWT automatically via secure, HttpOnly cookies for web browsers (CORS policy strictly configured with credentials enabled).</li>
          <li><strong>Bearer Tokens (Mobile/Fallbacks)</strong>: Check headers for <code class="font-mono text-zinc-200">Authorization: Bearer &lt;JWT&gt;</code>.</li>
        </ul>
      </section>

      <!-- Section: Error Handling -->
      <section id="error-handling" class="scroll-mt-24 space-y-6 max-w-4xl">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Error System</h2>
        </div>
        <p class="text-zinc-400 text-sm leading-relaxed">
          All client-side and business logic failures follow a standardized envelope schema returning detailed messages:
        </p>
        <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto max-w-xl"><code>{
  "status": "error",
  "message": "Detailed description of validation or logic failure."
}</code></pre>
      </section>

      <!-- Group: Authentication Endpoints -->
      <section class="space-y-16">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Authentication APIs</h2>
        </div>

        <!-- Endpoint: POST /auth/register -->
        <div id="endpoint-register" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
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
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">email</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Valid email format.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">password</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Minimum 6 characters.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">name</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Minimum 2 characters.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/register', {
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
              Verifies credentials, generates active session block, and sets the secure HttpOnly cookie.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/login</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/login', {
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
      "role": "student",
      "status": "active"
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
            <h3 class="text-2xl font-semibold text-zinc-100">Get profile (Me)</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Returns the currently authenticated student session profile.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/auth/me</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/me', {
  method: 'GET'
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

        <!-- Endpoint: POST /auth/refresh -->
        <div id="endpoint-refresh" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Refresh session</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Validates the active session and delivers a refreshed JWT inside an updated HttpOnly cookie.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/refresh</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/refresh', {
  method: 'POST'
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /auth/logout -->
        <div id="endpoint-logout" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Authentication</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Logout</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Destroys the session key from Redis cache and clears the client-side JWT token cookie.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/auth/logout</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/logout', {
  method: 'POST'
});</code></pre>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-zinc-900" />

      <!-- Group: Student Dashboard -->
      <section class="space-y-16">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Student Dashboard</h2>
        </div>

        <!-- Endpoint: GET /v1/student/courses -->
        <div id="endpoint-student-courses" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Dashboard</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Fetch Enrolled Courses</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Retrieves the complete list of courses (batches) where the student is enrolled and the payment status is marked as <code class="text-zinc-200">captured</code>.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/student/courses</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/courses', {
  method: 'GET'
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "courses": [
      {
        "enrollmentId": 12,
        "batchId": 8,
        "status": 1,
        "progress": 45,
        "timeSpentSeconds": 18200,
        "paymentStatus": "captured",
        "enrolledAt": "2026-07-01T12:00:00.000Z",
        "paidAt": "2026-07-01T12:05:00.000Z",
        "accessTill": "2026-09-01",
        "courseStartDate": "2026-07-01",
        "amountPayable": 25000,
        "amountPaid": 25000,
        "amountRemaining": 0,
        "batch": {
          "name": "Fullstack Web Development",
          "topic": "Next.js & TypeScript Cohort",
          "type": "cohort",
          "img": "https://img.codekaro.in/fullstack.png"
        }
      }
    ]
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /v1/student/courses/:batchId -->
        <div id="endpoint-student-course-details" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Dashboard</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Course Details (Syllabus & Progress)</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Returns the complete course syllabus structure (sections and contents arranged in order), linked with real-time course progress tracking for the currently logged-in student.
            </p>
            <div class="space-y-2 text-zinc-400 text-xs leading-relaxed">
              <p><strong>Access Calculations:</strong></p>
              <ul class="list-disc pl-5 space-y-1">
                <li><code class="font-mono text-zinc-200">startedAt</code>: defaults to <code class="font-mono text-zinc-200">startedAt || paidAt || createdAt</code>.</li>
                <li><code class="font-mono text-zinc-200">accessTill</code>: defaults to <code class="font-mono text-zinc-200">accessTill || (startedAt + 1 year)</code>.</li>
                <li><code class="font-mono text-zinc-200">daysPassed</code>: number of days passed since the start date.</li>
                <li><code class="font-mono text-zinc-200">isAccessActive</code>: <code class="font-mono text-zinc-200">true</code> if today's date is less than or equal to the access end date.</li>
              </ul>
            </div>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/student/courses/:batchId</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Target batch/course numeric ID.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/courses/1', {
  method: 'GET'
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "enrollment": {
      "id": 12,
      "status": 1,
      "progress": 45,
      "timeSpentSeconds": 18200,
      "paymentStatus": "captured",
      "startedAt": "2026-07-01T12:00:00.000Z",
      "accessTill": "2027-07-01T12:00:00.000Z",
      "daysPassed": 10,
      "isAccessActive": true,
      "amountPayable": 25000,
      "amountPaid": 25000,
      "amountRemaining": 0
    },
    "sections": [
      {
        "id": 1,
        "title": "Introduction to Cohort",
        "order": 1,
        "contents": [
          {
            "id": 44,
            "contentId": 5,
            "sectionId": 1,
            "order": 1,
            "accessOn": null,
            "accessTill": null,
            "content": {
              "id": 5,
              "title": "Welcome Onboard Video",
              "desc": "Introduction class content",
              "type": "video",
              "contentType": "video/mp4",
              "videoLink": "https://video.codekaro.in/intro.mp4"
            },
            "progress": {
              "status": "completed",
              "timeSpent": 180,
              "progress": 100
            }
          }
        ]
      }
    ]
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /v1/student/courses/content/:batchContentId/access -->
        <div id="endpoint-student-content-access" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Dashboard</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Verify Content Access</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Performs strict backend checks before a user watches a video or starts an assignment. Validates that the user's enrollment is active, payment is captured, the item is unlocked (days passed &ge; <code class="font-mono text-zinc-200">accessOn</code>), and the item has not expired (days passed &le; <code class="font-mono text-zinc-200">accessTill</code> or calendar dates are not exceeded).
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/student/courses/content/:batchContentId/access</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">batchContentId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch content unique ID.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/courses/content/44/access', {
  method: 'GET'
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK - Allowed)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "allowed": true
  }
}</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK - Denied)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "allowed": false,
    "reason": "Content unlocks in 2 days"
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /v1/student/courses/content/progress -->
        <div id="endpoint-student-progress-log" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Dashboard</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update Progress Heartbeat</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates the student's progress tracking indicators. Tailored to be hit periodically (e.g., every 1 minute) while a user is actively watching a video course or completing assignments.
            </p>
            <div class="space-y-2 text-zinc-400 text-xs leading-relaxed">
              <p><strong>High-Performance Aggregations:</strong></p>
              <ul class="list-disc pl-5 space-y-1">
                <li><code class="font-mono text-zinc-200">timeSpent</code>: The value passed represents the elapsed time delta (e.g. 60 seconds) since the last ping. The backend atomically increments the cumulative database counter.</li>
                <li><code class="font-mono text-zinc-200">progress</code>: The backend updates the progress to the maximum of the current value and the new value.</li>
                <li><code class="font-mono text-zinc-200">Enrollment Aggregates</code>: Automatically increments total course viewing duration and re-calculates batch average completion percentage in a single optimized query.</li>
              </ul>
            </div>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/student/courses/content/progress</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchContentId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch content unique ID.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">timeSpent</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Delta time spent in seconds (default 0).</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">progress</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Completion progress percentage (0-100).</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'not_started' | 'learning' | 'completed'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/courses/content/progress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    batchContentId: 44,
    timeSpent: 60,
    progress: 45,
    status: 'learning'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": 105,
    "userId": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
    "enrollmentId": 12,
    "batchContentId": 44,
    "timeSpent": 240,
    "progress": 45,
    "status": "learning",
    "createdAt": "2026-07-01T12:00:00.000Z",
    "updatedAt": "2026-07-11T12:30:00.000Z"
  }
}</code></pre>
            </div>
          </div>
        </div>

        <!-- Endpoint: POST /v1/student/courses/content/:batchContentId/assignment -->
        <div id="endpoint-student-submit-assignment" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8 pt-12">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Dashboard</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Submit Assignment</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Submits assignment project URLs, text remarks, and solution source code for a specific course content item. **Note:** Students can only submit if their current assignment status is <code class="font-mono text-zinc-200">'pending'</code> (unlocked after watching 10 minutes of the video). Submitting when status is null or not 'pending' returns a 403 Forbidden error. On success, sets the status to <code class="font-mono text-zinc-200">'submitted'</code> and marks progress as <code class="font-mono text-zinc-200">100% completed</code>.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/student/courses/content/:batchContentId/assignment</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">githubLink</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Valid GitHub URL.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">deployedLink</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Valid live deployment URL.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">userRemark</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Optional text notes or comments for the teacher.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">codeSubmitted</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Source code text block.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/courses/content/44/assignment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    githubLink: 'https://github.com/student/repo',
    deployedLink: 'https://demo.vercel.app',
    userRemark: 'Please check the layout responsive checks.'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": 105,
    "userId": "8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1",
    "enrollmentId": 12,
    "batchContentId": 44,
    "timeSpent": 240,
    "progress": 100,
    "status": "completed",
    "githubLink": "https://github.com/student/repo",
    "deployedLink": "https://demo.vercel.app",
    "assignmentStatus": "submitted",
    "userRemark": "Please check the layout responsive checks.",
    "createdAt": "2026-07-01T12:00:00.000Z",
    "updatedAt": "2026-07-11T12:40:00.000Z"
  }
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-zinc-900" />

      <!-- Group: Student Course Progress -->
      <section class="space-y-16">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Student: Course Progress</h2>
        </div>

        <!-- Endpoint: POST /course-progress -->
        <div id="progress-upsert" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Progress</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update progress</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Logs or updates progress tracking metrics (time spent, completion percentage) for a specific content module inside a student's enrolled course.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/course-progress</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">enrollmentId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch enrollment identifier.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchContentId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Associated batch content library node.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">timeSpent</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Seconds spent viewing/interacting.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">progress</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Progress score between 0 and 100.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'not_started' | 'learning' | 'completed'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/course-progress', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    enrollmentId: 12,
    batchContentId: 44,
    timeSpent: 180,
    progress: 100,
    status: 'completed'
  })
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": 105,
    "enrollmentId": 12,
    "batchContentId": 44,
    "timeSpent": 180,
    "progress": 100,
    "status": "completed"
  }
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /course-progress/batches/:batchId -->
        <div id="progress-get-batch" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Progress</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get batch progress</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Fetches all content-level progress logs for a specific batch (course) to paint completion indicators.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/course-progress/batches/:batchId</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/course-progress/batches/1', {
  method: 'GET'
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "progress": [
      {
        "id": 105,
        "batchContentId": 44,
        "timeSpent": 180,
        "progress": 100,
        "status": "completed"
      }
    ]
  }
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-zinc-900" />

      <!-- Group: Student Payments -->
      <section class="space-y-16">
        <div class="border-b border-zinc-900 pb-2">
          <h2 class="text-2xl font-normal text-zinc-50 font-mono">Student: Payments</h2>
        </div>

        <!-- Endpoint: GET /payments -->
        <div id="student-payments" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase">Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get Payment History</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Fetches all captured payment records associated with the authenticated student's course enrollments.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/student/payments</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/student/payments', {
  method: 'GET'
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "data": [
    {
      "id": 1,
      "amount": 4999,
      "paidAt": "2026-07-01T12:00:00.000Z",
      "paymentMethod": "UPI",
      "transactionId": "pay_XYZ123",
      "invoiceId": "INV-2026-001",
      "purpose": "enrollment",
      "isGstApplicable": true,
      "remarks": "Initial batch fee payment",
      "courseName": "Full Stack Web Development"
    }
  ]
}</code></pre>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</body>
</html>`;
}
