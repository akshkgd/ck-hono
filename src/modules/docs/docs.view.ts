export function getDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth font-sans">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Codekaro API Documentation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
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
  <!-- Google Fonts & Highlight.js -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/tokyo-night-dark.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #0a0a0a;
    }
    ::-webkit-scrollbar-thumb {
      background: #262626;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #404040;
    }
    /* HighlightJS Overrides */
    .hljs {
      background: transparent !important;
      padding: 0 !important;
    }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-200 antialiased min-h-screen flex">

  <!-- Sidebar -->
  <aside class="w-60 border-r border-neutral-900 bg-neutral-950 fixed h-screen overflow-y-auto hidden md:block z-20 flex flex-col justify-between">
    <div class="p-6">
      <div class="flex items-center space-x-2.5 mb-8">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-neutral-50 text-sm tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-neutral-50 font-semibold tracking-wide text-sm">Codekaro API</span>
      </div>
      
      <nav class="space-y-5">
        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Getting Started</h3>
          <ul class="space-y-1.5">
            <li><a href="#overview" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">/v1</a></li>
            <li><a href="#health" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /v1</a></li>
          </ul>
        </div>
        
        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Authentication</h3>
          <ul class="space-y-1.5">
            <li><a href="#auth-register" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /auth/register</a></li>
            <li><a href="#auth-login" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /auth/login</a></li>
            <li><a href="#auth-me" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /auth/me</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin User Management</h3>
          <ul class="space-y-1.5">
            <li><a href="#admin-search" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/users</a></li>
            <li><a href="#admin-add" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /admin/users</a></li>
            <li><a href="#admin-edit" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PUT /admin/users/:id</a></li>
            <li><a href="#admin-role" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PATCH /admin/users/:id/role</a></li>
            <li><a href="#admin-status" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PATCH /admin/users/:id/status</a></li>
            <li><a href="#admin-delete" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">DELETE /admin/users/:id</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Batch Management</h3>
          <ul class="space-y-1.5">
            <li><a href="#admin-batch-search" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/batches</a></li>
            <li><a href="#admin-batch-get" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/batches/:id</a></li>
            <li><a href="#admin-batch-create" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /admin/batches</a></li>
            <li><a href="#admin-batch-update" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PUT /admin/batches/:id</a></li>
            <li><a href="#admin-batch-delete" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">DELETE /admin/batches/:id</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Enrollment Management</h3>
          <ul class="space-y-1.5">
            <li><a href="#admin-enrollment-search" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/enrollments</a></li>
            <li><a href="#admin-enrollment-get" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/enrollments/:id</a></li>
            <li><a href="#admin-enrollment-create" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /admin/enrollments</a></li>
            <li><a href="#admin-enrollment-update" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PUT /admin/enrollments/:id</a></li>
            <li><a href="#admin-enrollment-delete" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">DELETE /admin/enrollments/:id</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Payment Management</h3>
          <ul class="space-y-1.5">
            <li><a href="#admin-payment-search" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/enrollment-payments</a></li>
            <li><a href="#admin-payment-get" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">GET /admin/enrollment-payments/:id</a></li>
            <li><a href="#admin-payment-create" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">POST /admin/enrollment-payments</a></li>
            <li><a href="#admin-payment-update" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">PUT /admin/enrollment-payments/:id</a></li>
            <li><a href="#admin-payment-delete" class="block text-xs text-neutral-400 hover:text-indigo-400 transition font-medium font-mono">DELETE /admin/enrollment-payments/:id</a></li>
          </ul>
        </div>

        <div>
          <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">User & Gamification</h3>
          <ul class="space-y-1.5">
            <li><span class="block text-xs text-neutral-600 cursor-not-allowed font-medium">Profile Management <span class="text-[9px] ml-1 bg-neutral-900 text-neutral-500 px-1 py-0.2 rounded font-normal font-sans">Soon</span></span></li>
            <li><span class="block text-xs text-neutral-600 cursor-not-allowed font-medium">Streaks & XP <span class="text-[9px] ml-1 bg-neutral-900 text-neutral-500 px-1 py-0.2 rounded font-normal font-sans">Soon</span></span></li>
          </ul>
        </div>
      </nav>
    </div>
    
    <div class="p-6 border-t border-neutral-900">
      <div class="text-[10px] text-neutral-500 flex justify-between items-center font-medium">
        <span>V1.0.0</span>
        <span class="flex items-center text-green-500"><span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span> Live</span>
      </div>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="md:hidden w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md fixed top-0 left-0 right-0 z-30 p-4 flex justify-between items-center">
    <div class="flex items-center space-x-2.5">
      <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-bold text-neutral-50 text-sm">CK</div>
      <span class="text-neutral-50 font-semibold tracking-wide text-sm">Codekaro API</span>
    </div>
    <button id="mobileMenuBtn" class="text-neutral-400 hover:text-neutral-50">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>
  </header>

  <!-- Mobile Drawer Menu -->
  <div id="mobileDrawer" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity flex justify-end">
    <div class="w-60 bg-neutral-950 h-full p-6 border-l border-neutral-900 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center mb-8">
          <span class="text-neutral-50 font-semibold text-sm">Menu</span>
          <button id="closeDrawerBtn" class="text-neutral-400 hover:text-neutral-50">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav class="space-y-6">
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Getting Started</h3>
            <ul class="space-y-1">
              <li><a href="#overview" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Overview</a></li>
              <li><a href="#health" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Health Status</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Authentication</h3>
            <ul class="space-y-1">
              <li><a href="#auth-register" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Register</a></li>
              <li><a href="#auth-login" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Login</a></li>
              <li><a href="#auth-me" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Get Profile (Me)</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin User Management</h3>
            <ul class="space-y-1">
              <li><a href="#admin-search" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Search Users</a></li>
              <li><a href="#admin-add" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Add User</a></li>
              <li><a href="#admin-edit" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Edit User</a></li>
              <li><a href="#admin-role" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Update Role</a></li>
              <li><a href="#admin-status" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Update Status</a></li>
              <li><a href="#admin-delete" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Delete User</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Batch Management</h3>
            <ul class="space-y-1">
              <li><a href="#admin-batch-search" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Search Batches</a></li>
              <li><a href="#admin-batch-get" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Get Batch Details</a></li>
              <li><a href="#admin-batch-create" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Create Batch</a></li>
              <li><a href="#admin-batch-update" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Update Batch</a></li>
              <li><a href="#admin-batch-delete" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Delete Batch</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Enrollment Management</h3>
            <ul class="space-y-1">
              <li><a href="#admin-enrollment-search" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Search Enrollments</a></li>
              <li><a href="#admin-enrollment-get" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Get Enrollment Details</a></li>
              <li><a href="#admin-enrollment-create" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Create Enrollment</a></li>
              <li><a href="#admin-enrollment-update" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Update Enrollment</a></li>
              <li><a href="#admin-enrollment-delete" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Delete Enrollment</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Admin Payment Management</h3>
            <ul class="space-y-1">
              <li><a href="#admin-payment-search" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Search Payments</a></li>
              <li><a href="#admin-payment-get" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Get Payment Details</a></li>
              <li><a href="#admin-payment-create" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Record Payment</a></li>
              <li><a href="#admin-payment-update" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Update Payment</a></li>
              <li><a href="#admin-payment-delete" class="block py-1 text-xs text-neutral-400 hover:text-indigo-400">Delete Payment</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="border-t border-neutral-900 pt-4 text-xs text-neutral-500">Version 1.0.0</div>
    </div>
  </div>

  <!-- Main Content Wrapper -->
  <main class="flex-1 md:ml-60 p-6 md:p-10 mt-14 md:mt-0 max-w-6xl mx-auto space-y-16">

    <!-- Section: Overview -->
    <section id="overview" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-5">
        <h1 class="text-2xl font-bold text-neutral-50 tracking-tight">API Documentation (V1)</h1>
        <p class="text-neutral-400 mt-1.5 text-sm">Detailed reference for frontend engineers integrating with the Codekaro Hono API.</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-3.5">
          <h2 class="text-base font-semibold text-neutral-100">Base URL & Versioning</h2>
          <p class="text-neutral-400 text-xs leading-relaxed">All requests should be sent to the base host of the application server with the version prefix. For local development, this is:</p>
          <div class="bg-neutral-900 border border-neutral-800/80 rounded px-3 py-2 flex justify-between items-center font-mono text-xs text-neutral-200">
            <span>http://localhost:3000/v1</span>
            <button onclick="copyToClipboard('http://localhost:3000/v1')" class="text-indigo-400 hover:text-indigo-300 font-sans text-xs">Copy</button>
          </div>
          <h2 class="text-base font-semibold text-neutral-100 pt-3">Headers & Requests</h2>
          <p class="text-neutral-400 text-xs leading-relaxed">All JSON payloads sent in request bodies must include the following header:</p>
          <code class="block bg-neutral-900 border border-neutral-800/85 rounded p-2.5 text-xs text-indigo-400 font-mono">Content-Type: application/json</code>
        </div>
        
        <div class="space-y-3.5">
          <h2 class="text-base font-semibold text-neutral-100">Authentication</h2>
          <p class="text-neutral-400 text-xs leading-relaxed">Secure endpoints require a Bearer token in the <code class="text-xs bg-neutral-900 px-1 py-0.5 rounded text-indigo-400 font-mono">Authorization</code> header. Obtain a token via the login API:</p>
          <code class="block bg-neutral-900 border border-neutral-800/85 rounded p-2.5 text-xs text-indigo-400 font-mono">Authorization: Bearer &lt;your-jwt-token&gt;</code>
          <p class="text-[11px] text-neutral-500">Tokens are signed via JWT (HS256) and are configured to expire in <strong>30 days</strong>.</p>
        </div>
      </div>
    </section>

    <!-- Section: System Health -->
    <section id="health" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Get overall system metrics and database connection status.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left Column: Details -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-1.5">Request Details</h3>
            <p class="text-neutral-400 text-xs leading-relaxed font-normal">No request body or authentication is required. Returns a 200 status when all checks pass, and a 503 status if dependencies (like PostgreSQL) are failing.</p>
          </div>
          
          <!-- Live Playground -->
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <button onclick="runHealthCheck()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Send Request</button>
            <div id="healthResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="healthResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-850 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="healthResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Right Column: Code Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "UP",
  "message": "all systems running good",
  "timestamp": "2026-06-26T04:00:00.000Z",
  "uptime": 124.52,
  "test": "ci/cd pipeline final test success",
  "system": {
    "platform": "darwin",
    "nodeVersion": "v24.15.0",
    "cpuLoad": [2.35, 2.12, 2.01],
    "memory": {
      "rss": "55.20 MB",
      "heapTotal": "10.40 MB",
      "heapUsed": "6.80 MB",
      "external": "1.25 MB"
    }
  },
  "checks": {
    "database": "healthy"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Register -->
    <section id="auth-register" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/auth/register</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Create a new user account on Codekaro.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Request Schema</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <thead class="text-[10px] uppercase text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th class="py-1.5">Field</th>
                  <th class="py-1.5">Type</th>
                  <th class="py-1.5">Requirement</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">email</td>
                  <td class="py-2">string</td>
                  <td class="py-2 text-red-500/80">Required (Email format)</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">password</td>
                  <td class="py-2">string</td>
                  <td class="py-2 text-red-500/80">Required (Min 6 chars)</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">name</td>
                  <td class="py-2">string</td>
                  <td class="py-2 text-neutral-600 font-medium">Optional (Min 2 chars)</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">mobile</td>
                  <td class="py-2">string</td>
                  <td class="py-2 text-neutral-600 font-medium">Optional (E.164 phone)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Email</label>
                <input id="regEmail" type="email" placeholder="example@test.com" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Password</label>
                <input id="regPassword" type="password" placeholder="Min 6 characters" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Name</label>
                <input id="regName" type="text" placeholder="Your Name" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Mobile</label>
                <input id="regMobile" type="text" placeholder="+919999999999" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runRegister()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Register User</button>
            
            <div id="regResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="regResponseCode" class="font-mono">201</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="regResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (201 Created)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "email": "priya.verma@example.com",
    "name": "Priya Verma",
    "mobile": "+919876543210",
    "avatarUrl": null,
    "bio": null,
    "linkedinUrl": null,
    "githubUrl": null,
    "occupationType": "other",
    "occupationTitle": null,
    "organization": null,
    "experienceYears": null,
    "role": "user",
    "status": "active",
    "googleId": null,
    "emailVerified": false,
    "xp": 0,
    "currentStreak": 0,
    "longestStreak": 0,
    "metadata": {},
    "createdAt": "2026-06-26T04:15:00.000Z",
    "updatedAt": "2026-06-26T04:15:00.000Z"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Login -->
    <section id="auth-login" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/auth/login</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Log in and acquire a JWT Bearer token.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-1.5">Login Credentials</h3>
            <p class="text-neutral-400 text-xs leading-relaxed">Send credentials in the JSON request body. Upon successful login, you will receive the JWT token and user profile details.</p>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Email</label>
                <input id="loginEmail" type="email" value="aarav.sharma0@example.com" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Password</label>
                <input id="loginPassword" type="password" value="Password123!" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <div class="flex items-center justify-between">
              <button onclick="runLogin()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Log In</button>
              <span id="savedTokenIndicator" class="text-xs text-green-400 hidden font-medium">✓ Token saved locally!</span>
            </div>
            
            <div id="loginResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="loginResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-850 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="loginResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
      "email": "aarav.sharma0@example.com",
      "name": "Aarav Sharma",
      "mobile": "+917004812342",
      "avatarUrl": "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav",
      "bio": "Hi, I am Aarav Sharma. I am a Undergraduate Student based in India.",
      "linkedinUrl": "https://linkedin.com/in/aarav-sharma-0",
      "githubUrl": "https://github.com/aarav-0",
      "occupationType": "student",
      "occupationTitle": "Undergraduate Student",
      "organization": "IIT Bombay",
      "experienceYears": 0,
      "role": "student",
      "status": "active",
      "googleId": null,
      "emailVerified": false,
      "xp": 50,
      "currentStreak": 0,
      "longestStreak": 0,
      "metadata": { "initialized": true },
      "createdAt": "2026-06-26T04:00:00.000Z",
      "updatedAt": "2026-06-26T04:00:00.000Z"
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Me -->
    <section id="auth-me" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/auth/me</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Fetch details of the authenticated user using a JWT token.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Authentication Headers</h3>
            <p class="text-neutral-400 text-xs leading-relaxed mb-3">You must pass the token acquired from <code class="text-xs bg-neutral-900 px-1 py-0.5 rounded text-indigo-400 font-mono">/v1/auth/login</code> inside the <code class="text-xs bg-neutral-900 px-1 py-0.5 rounded text-indigo-400 font-mono">Authorization</code> header.</p>
            <div class="bg-neutral-900 border border-neutral-800 rounded p-3 font-mono text-[11px] space-y-1">
              <span class="text-neutral-500 font-medium">Headers:</span>
              <div class="text-neutral-200">Authorization: Bearer <span id="tokenPlaceholder" class="text-indigo-400 truncate inline-block max-w-[220px] align-bottom">&lt;token-missing&gt;</span></div>
            </div>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="flex items-center space-x-3">
              <button onclick="runFetchProfile()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Fetch My Profile</button>
              <button onclick="clearToken()" class="px-3 py-1.5 border border-neutral-800 hover:bg-neutral-950 text-neutral-400 hover:text-neutral-200 rounded text-[11px] font-medium transition">Clear Token</button>
            </div>
            
            <div id="meResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="meResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-850 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="meResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "user": {
      "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
      "email": "aarav.sharma0@example.com",
      "name": "Aarav Sharma",
      "mobile": "+917004812342",
      "avatarUrl": "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav",
      "bio": "Hi, I am Aarav Sharma. I am a Undergraduate Student based in India.",
      "linkedinUrl": "https://linkedin.com/in/aarav-sharma-0",
      "githubUrl": "https://github.com/aarav-0",
      "occupationType": "student",
      "occupationTitle": "Undergraduate Student",
      "organization": "IIT Bombay",
      "experienceYears": 0,
      "role": "student",
      "status": "active",
      "googleId": null,
      "emailVerified": false,
      "xp": 50,
      "currentStreak": 0,
      "longestStreak": 0,
      "metadata": { "initialized": true },
      "createdAt": "2026-06-26T04:00:00.000Z",
      "updatedAt": "2026-06-26T04:00:00.000Z"
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Search Users -->
    <section id="admin-search" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Search all registered users by email or name with pagination support. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Query Parameters</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <thead class="text-[10px] uppercase text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th class="py-1.5">Parameter</th>
                  <th class="py-1.5">Type</th>
                  <th class="py-1.5">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">q</td>
                  <td class="py-2">string</td>
                  <td class="py-2">Search term (matches name or email). Defaults to empty (returns all).</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">limit</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Number of items to return (1-50). Defaults to 10.</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">page</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Current page number. Defaults to 1.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Search Term (q)</label>
                <input id="adminSearchQ" type="text" placeholder="e.g. Sharma" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Limit</label>
                <input id="adminSearchLimit" type="number" value="5" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Page</label>
                <input id="adminSearchPage" type="number" value="1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runAdminSearch()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Search Users</button>
            
            <div id="adminSearchResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminSearchResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminSearchResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
        "email": "aarav.sharma0@example.com",
        "name": "Aarav Sharma"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Add User -->
    <section id="admin-add" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Create a new user with custom administrative privileges (role and status setup). <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Request Body</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">email / password</td>
                  <td class="py-2 text-red-500/80">Required</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">role</td>
                  <td class="py-2">student | admin | user | moderator (optional)</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">status</td>
                  <td class="py-2">active | inactive | suspended (optional)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Email</label>
                <input id="adminAddEmail" type="email" placeholder="new-user@gmail.com" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Password</label>
                <input id="adminAddPassword" type="password" placeholder="Password123!" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Role</label>
                <select id="adminAddRole" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="user">user</option>
                  <option value="student">student</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Status</label>
                <select id="adminAddStatus" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>
            </div>
            <button onclick="runAdminAddUser()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm font-sans">Add User</button>
            
            <div id="adminAddResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminAddResponseCode" class="font-mono">201</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminAddResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippet -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (201 Created)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "User added successfully",
  "data": {
    "id": "c1089224-b152-47ea-bd00-b8d1a1b41aa8",
    "email": "new-user@gmail.com",
    "role": "user",
    "status": "active"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Edit User -->
    <section id="admin-edit" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PUT</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Edit user profile details and database statistics by ID. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2 font-sans">Playground</h3>
            <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">User ID to Edit</label>
                <input id="adminEditId" type="text" placeholder="PASTE_USER_UUID_HERE" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div class="grid grid-cols-2 gap-3.5">
                <div>
                  <label class="block text-[10px] text-neutral-400 mb-1">New Name</label>
                  <input id="adminEditName" type="text" placeholder="Amit Kumar" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-[10px] text-neutral-400 mb-1">New Mobile</label>
                  <input id="adminEditMobile" type="text" placeholder="+918888888888" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-[10px] text-neutral-400 mb-1">XP Points</label>
                  <input id="adminEditXp" type="number" placeholder="500" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                  <label class="block text-[10px] text-neutral-400 mb-1">Experience Years</label>
                  <input id="adminEditExp" type="number" placeholder="5" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                </div>
              </div>
              <button onclick="runAdminEditUser()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm font-sans">Save Changes</button>
              
              <div id="adminEditResponseWrapper" class="hidden space-y-1.5">
                <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminEditResponseCode" class="font-mono">200</span></span>
                <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminEditResponseJson"></code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Snippets -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "name": "Amit Kumar",
    "experienceYears": 5,
    "xp": 500
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Update User Role -->
    <section id="admin-role" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PATCH</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users/:id/role</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Update the role of a user. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Request Body</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">role</td>
                  <td class="py-2 text-red-500/80">Required (student | admin | user | moderator)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">User ID (UUID)</label>
                <input id="adminRoleUserId" type="text" placeholder="PASTE_USER_UUID_HERE" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Role</label>
                <select id="adminRoleSelect" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="student">student</option>
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>
            <button onclick="runUpdateRoleOnly()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Update Role</button>
            
            <div id="adminRoleResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminRoleResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminRoleResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippet -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "email": "aarav.sharma0@example.com",
    "name": "Aarav Sharma",
    "role": "admin",
    "status": "active"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Update User Status -->
    <section id="admin-status" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PATCH</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users/:id/status</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Update the account status of a user (suspend, activate, etc.). <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Request Body</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">status</td>
                  <td class="py-2 text-red-500/80">Required (active | inactive | suspended)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-855 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">User ID (UUID)</label>
                <input id="adminStatusUserId" type="text" placeholder="PASTE_USER_UUID_HERE" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Status</label>
                <select id="adminStatusSelect" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="suspended">suspended</option>
                </select>
              </div>
            </div>
            <button onclick="runUpdateStatusOnly()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Update Status</button>
            
            <div id="adminStatusResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminStatusResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminStatusResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippet -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "User status updated successfully",
  "data": {
    "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "email": "aarav.sharma0@example.com",
    "name": "Aarav Sharma",
    "role": "admin",
    "status": "suspended"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Delete User -->
    <section id="admin-delete" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold uppercase font-mono">DELETE</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/users/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Destructively delete a user account from the system by ID. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Details & Playground -->
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">User ID to Delete (UUID)</label>
              <input id="adminDeleteUserId" type="text" placeholder="PASTE_USER_UUID_HERE" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runDeleteUserOnly()" class="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-900/50 rounded text-xs font-medium transition shadow-sm">Delete User</button>
            
            <div id="adminDeleteResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="adminDeleteResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="adminDeleteResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <!-- Snippet -->
        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "User deleted successfully"
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Search/List Batches -->
    <section id="admin-batch-search" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/batches</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Search all registered batches by name, topic, or slug with pagination support. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Query Parameters</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <thead class="text-[10px] uppercase text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th class="py-1.5">Parameter</th>
                  <th class="py-1.5">Type</th>
                  <th class="py-1.5">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">q</td>
                  <td class="py-2">string</td>
                  <td class="py-2">Search query term matching name, topic, or slug.</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">limit</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Max records to return (1-50, default 10).</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">page</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Page number (default 1).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Search (q)</label>
                <input id="batchSearchQ" type="text" placeholder="e.g. Hono" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Limit</label>
                <input id="batchSearchLimit" type="number" value="10" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Page</label>
                <input id="batchSearchPage" type="number" value="1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runBatchSearch()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Search Batches</button>
            <div id="batchSearchResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="batchSearchResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="batchSearchResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "batches": [
      {
        "id": 1,
        "name": "Web Development Masterclass",
        "topic": "Hono Framework",
        "slug": "web-development-masterclass",
        "price": 499,
        "type": "cohort",
        "status": "private",
        "startDate": "2026-07-01",
        "endDate": "2026-08-01"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Get Batch Details -->
    <section id="admin-batch-get" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/batches/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Retrieve detail record for a specific batch by ID. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Batch ID (Integer)</label>
              <input id="batchGetId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runBatchGet()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Get Batch Details</button>
            <div id="batchGetResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="batchGetResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="batchGetResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "id": 1,
    "topic": "Hono Framework",
    "name": "Web Development Masterclass",
    "description": "Learn Hono backend development",
    "slug": "web-development-masterclass",
    "price": 499,
    "certificateFee": 50,
    "limit": 100,
    "type": "cohort",
    "startDate": "2026-07-01",
    "endDate": "2026-08-01",
    "status": "private",
    "metadata": { "cohortNumber": 1 }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Create Batch -->
    <section id="admin-batch-create" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/batches</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Create a new batch course record. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Name</label>
                <input id="batchCreateName" type="text" placeholder="Hono Live Bootcamp" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Slug</label>
                <input id="batchCreateSlug" type="text" placeholder="hono-live-bootcamp" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Topic</label>
                <input id="batchCreateTopic" type="text" placeholder="TypeScript" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Price (INR)</label>
                <input id="batchCreatePrice" type="number" value="1999" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Start Date</label>
                <input id="batchCreateStartDate" type="text" value="2026-07-01" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">End Date</label>
                <input id="batchCreateEndDate" type="text" value="2026-08-01" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Type</label>
                <select id="batchCreateType" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="cohort">cohort</option>
                  <option value="live">live</option>
                  <option value="webinar">webinar</option>
                  <option value="callBooking">callBooking</option>
                  <option value="mentorship">mentorship</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Status</label>
                <select id="batchCreateStatus" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="private">private</option>
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </div>
            </div>
            <button onclick="runBatchCreate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Create Batch</button>
            <div id="batchCreateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="batchCreateResponseCode" class="font-mono">201</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="batchCreateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (201 Created)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "Batch created successfully",
  "data": {
    "id": 2,
    "name": "Hono Live Bootcamp",
    "slug": "hono-live-bootcamp",
    "price": 1999,
    "type": "cohort",
    "status": "private",
    "startDate": "2026-07-01",
    "endDate": "2026-08-01"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Update Batch -->
    <section id="admin-batch-update" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PUT</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/batches/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Update course batch properties. Partial parameters are accepted. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-sans">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Batch ID to Edit (Integer)</label>
              <input id="batchUpdateId" type="number" placeholder="e.g. 2" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">New Name</label>
                <input id="batchUpdateName" type="text" placeholder="Advanced Hono Boot" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">New Price (INR)</label>
                <input id="batchUpdatePrice" type="number" placeholder="2499" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runBatchUpdate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Save Changes</button>
            <div id="batchUpdateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="batchUpdateResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="batchUpdateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Batch updated successfully",
  "data": {
    "id": 2,
    "name": "Advanced Hono Boot",
    "price": 2499
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Delete Batch -->
    <section id="admin-batch-delete" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold uppercase font-mono">DELETE</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/batches/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Permanently remove a batch course record from the system. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Batch ID to Delete (Integer)</label>
              <input id="batchDeleteId" type="number" placeholder="e.g. 2" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runBatchDelete()" class="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-900/50 rounded text-xs font-medium transition shadow-sm">Delete Batch</button>
            <div id="batchDeleteResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="batchDeleteResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="batchDeleteResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Batch deleted successfully"
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Search/List Enrollments -->
    <section id="admin-enrollment-search" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-5">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollments</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Search all student enrollments by student name/email or batch name with pagination support. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Query Parameters</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <thead class="text-[10px] uppercase text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th class="py-1.5">Parameter</th>
                  <th class="py-1.5">Type</th>
                  <th class="py-1.5">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">q</td>
                  <td class="py-2">string</td>
                  <td class="py-2">Search term matching user name, email, batch name, coupon, or transaction ID.</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">limit</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Max records to return (1-50, default 10).</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">page</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Page number (default 1).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Search (q)</label>
                <input id="enrollmentSearchQ" type="text" placeholder="e.g. Sharma" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Limit</label>
                <input id="enrollmentSearchLimit" type="number" value="10" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Page</label>
                <input id="enrollmentSearchPage" type="number" value="1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runEnrollmentSearch()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Search Enrollments</button>
            <div id="enrollmentSearchResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="enrollmentSearchResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="enrollmentSearchResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (200 OK)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "enrollments": [
      {
        "id": 1,
        "userId": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
        "batchId": 1,
        "enrollmentType": "oneTime",
        "status": 0,
        "progress": 0,
        "paymentStatus": "created",
        "createdAt": "2026-06-26T07:55:00.000Z",
        "user": {
          "name": "Aarav Sharma",
          "email": "aarav.sharma0@example.com"
        },
        "batch": {
          "name": "Web Development Masterclass"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Get Enrollment Details -->
    <section id="admin-enrollment-get" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Fetch full detail information for a specific enrollment record by ID. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Enrollment ID (Integer)</label>
              <input id="enrollmentGetId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runEnrollmentGet()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Get Details</button>
            <div id="enrollmentGetResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="enrollmentGetResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="enrollmentGetResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "id": 1,
    "userId": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "batchId": 1,
    "enrollmentType": "oneTime",
    "status": 0,
    "progress": 0,
    "timeSpentSeconds": 0,
    "amountPaid": 299,
    "paymentStatus": "created",
    "createdAt": "2026-06-26T07:55:00.000Z",
    "user": {
      "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
      "name": "Aarav Sharma",
      "email": "aarav.sharma0@example.com"
    },
    "batch": {
      "id": 1,
      "name": "Web Development Masterclass",
      "slug": "web-development-masterclass"
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Create Enrollment -->
    <section id="admin-enrollment-create" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollments</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Create a new batch enrollment for a student. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">User ID (UUID)</label>
                <input id="enrollmentCreateUserId" type="text" placeholder="PASTE_USER_UUID_HERE" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Batch ID (Integer)</label>
                <input id="enrollmentCreateBatchId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Amount Payable (INR)</label>
                <input id="enrollmentCreateAmountPayable" type="number" placeholder="e.g. 499" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Amount Paid (INR)</label>
                <input id="enrollmentCreateAmountPaid" type="number" value="299" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Type</label>
                <select id="enrollmentCreateType" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="oneTime">oneTime</option>
                  <option value="Subscription">Subscription</option>
                  <option value="free">free</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Payment Status</label>
                <select id="enrollmentCreatePaymentStatus" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="created">created</option>
                  <option value="captured">captured</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </div>
            </div>
            <button onclick="runEnrollmentCreate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Enroll User</button>
            <div id="enrollmentCreateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="enrollmentCreateResponseCode" class="font-mono">201</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="enrollmentCreateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example (201 Created)</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "Enrollment created successfully",
  "data": {
    "id": 1,
    "userId": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
    "batchId": 1,
    "amountPayable": 499,
    "enrollmentType": "oneTime",
    "status": 0,
    "progress": 0,
    "amountPaid": 299,
    "paymentStatus": "created"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Update Enrollment -->
    <section id="admin-enrollment-update" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PUT</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Update enrollment properties (e.g. status, progress, payment details). <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-sans">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Enrollment ID to Edit (Integer)</label>
              <input id="enrollmentUpdateId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Status Code (0-4)</label>
                <input id="enrollmentUpdateStatus" type="number" placeholder="1 = Active" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Progress (0-100)</label>
                <input id="enrollmentUpdateProgress" type="number" placeholder="e.g. 45" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Payment Status</label>
                <select id="enrollmentUpdatePaymentStatus" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="">No change</option>
                  <option value="created">created</option>
                  <option value="captured">captured</option>
                  <option value="failed">failed</option>
                  <option value="refunded">refunded</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Certificate ID</label>
                <input id="enrollmentUpdateCertId" type="text" placeholder="e.g. cert-99" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Amount Payable (INR)</label>
                <input id="enrollmentUpdateAmountPayable" type="number" placeholder="e.g. 499" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runEnrollmentUpdate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Save Changes</button>
            <div id="enrollmentUpdateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="enrollmentUpdateResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="enrollmentUpdateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Enrollment updated successfully",
  "data": {
    "id": 1,
    "status": 1,
    "progress": 45,
    "amountPayable": 499,
    "paymentStatus": "captured",
    "certificateId": "cert-99"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Delete Enrollment -->
    <section id="admin-enrollment-delete" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold uppercase font-mono">DELETE</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Destructively remove an enrollment record from the system. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Enrollment ID to Delete (Integer)</label>
              <input id="enrollmentDeleteId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runEnrollmentDelete()" class="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-900/50 rounded text-xs font-medium transition shadow-sm">Delete Enrollment</button>
            <div id="enrollmentDeleteResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="enrollmentDeleteResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="enrollmentDeleteResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Enrollment deleted successfully"
}</code></pre>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- ============ ADMIN ENROLLMENT PAYMENTS SECTION ========== -->
    <!-- ======================================================== -->

    <!-- Section: Admin Search/List Payments -->
    <section id="admin-payment-search" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-5">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollment-payments</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Search all recorded payments by student name, email, batch name, transaction ID, or payment method with pagination. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div>
            <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider mb-2">Query Parameters</h3>
            <table class="w-full text-left text-xs text-neutral-400">
              <thead class="text-[10px] uppercase text-neutral-500 border-b border-neutral-900">
                <tr>
                  <th class="py-1.5">Parameter</th>
                  <th class="py-1.5">Type</th>
                  <th class="py-1.5">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-900">
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">q</td>
                  <td class="py-2">string</td>
                  <td class="py-2">Search query term matching student, batch, transaction ID, invoice, or method.</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">limit</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Max records to return (default 10).</td>
                </tr>
                <tr>
                  <td class="py-2 text-indigo-400 font-mono">page</td>
                  <td class="py-2">number</td>
                  <td class="py-2">Page number (default 1).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Search (q)</label>
                <input id="paymentSearchQ" type="text" placeholder="e.g. UPI" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Limit</label>
                <input id="paymentSearchLimit" type="number" value="10" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Page</label>
                <input id="paymentSearchPage" type="number" value="1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runPaymentSearch()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Search Payments</button>
            <div id="paymentSearchResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="paymentSearchResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="paymentSearchResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "payments": [
      {
        "id": 1,
        "batchEnrollmentId": 12,
        "amount": 399,
        "paidAt": "2026-06-26T08:20:00.000Z",
        "paymentMethod": "UPI",
        "transactionId": "tx-12345",
        "invoiceId": "inv-9988",
        "purpose": "enrollment",
        "user": {
          "name": "Aarav Sharma",
          "email": "aarav.sharma0@example.com"
        },
        "batch": {
          "name": "TypeScript Masterclass"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Get Payment Details -->
    <section id="admin-payment-get" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-semibold uppercase font-mono">GET</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollment-payments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Retrieve detail record for a specific payment, including joined student, enrollment, and batch info. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Payment ID (Integer)</label>
              <input id="paymentGetId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runPaymentGet()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Get Details</button>
            <div id="paymentGetResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="paymentGetResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="paymentGetResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "data": {
    "id": 1,
    "batchEnrollmentId": 12,
    "amount": 399,
    "paidAt": "2026-06-26T08:20:00.000Z",
    "paymentMethod": "UPI",
    "transactionId": "tx-12345",
    "invoiceId": "inv-9988",
    "purpose": "enrollment",
    "isGstApplicable": true,
    "remarks": "Payment completed",
    "metadata": {},
    "enrollment": {
      "id": 12,
      "userId": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
      "batchId": 2
    },
    "user": {
      "id": "e9c15814-1cb6-41fb-a1e6-424a9a0890bf",
      "name": "Aarav Sharma",
      "email": "aarav.sharma0@example.com"
    },
    "batch": {
      "id": 2,
      "name": "TypeScript Masterclass"
    }
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Record Payment -->
    <section id="admin-payment-create" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">POST</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollment-payments</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Record a payment received for a batch enrollment. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Enrollment ID (Integer)</label>
                <input id="paymentCreateEnrollmentId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Amount Paid (INR)</label>
                <input id="paymentCreateAmount" type="number" value="399" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Paid At (ISO Date)</label>
                <input id="paymentCreatePaidAt" type="text" placeholder="e.g. 2026-06-26T13:50:00Z" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Payment Method</label>
                <input id="paymentCreateMethod" type="text" value="UPI" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Transaction ID</label>
                <input id="paymentCreateTxId" type="text" placeholder="e.g. pay_9988" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Invoice ID</label>
                <input id="paymentCreateInvoiceId" type="text" placeholder="e.g. inv_7766" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Purpose</label>
                <select id="paymentCreatePurpose" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
                  <option value="enrollment">enrollment</option>
                  <option value="renewal">renewal</option>
                  <option value="certificate">certificate</option>
                  <option value="upgrade">upgrade</option>
                  <option value="refund">refund</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Remarks</label>
                <input id="paymentCreateRemarks" type="text" placeholder="e.g. Manual entry" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runPaymentCreate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Record Payment</button>
            <div id="paymentCreateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="paymentCreateResponseCode" class="font-mono">201</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="paymentCreateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 max-h-72 overflow-y-auto text-xs"><code class="language-json">{
  "status": "success",
  "message": "Payment recorded successfully",
  "data": {
    "id": 1,
    "batchEnrollmentId": 12,
    "amount": 399,
    "paidAt": "2026-06-26T08:20:00.000Z",
    "paymentMethod": "UPI",
    "transactionId": "pay_9988",
    "invoiceId": "inv_7766",
    "purpose": "enrollment",
    "isGstApplicable": true
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Update Payment -->
    <section id="admin-payment-update" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-semibold uppercase font-mono">PUT</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollment-payments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Update recorded payment attributes. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider font-sans">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Payment ID to Edit (Integer)</label>
              <input id="paymentUpdateId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <div class="grid grid-cols-2 gap-3.5">
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Amount (INR)</label>
                <input id="paymentUpdateAmount" type="number" placeholder="e.g. 450" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Payment Method</label>
                <input id="paymentUpdateMethod" type="text" placeholder="e.g. Card" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
              <div>
                <label class="block text-[10px] text-neutral-400 mb-1">Remarks</label>
                <input id="paymentUpdateRemarks" type="text" placeholder="e.g. Updated remark" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500">
              </div>
            </div>
            <button onclick="runPaymentUpdate()" class="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-neutral-50 rounded text-xs font-medium transition shadow-sm">Save Changes</button>
            <div id="paymentUpdateResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="paymentUpdateResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="paymentUpdateResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Payment updated successfully",
  "data": {
    "id": 1,
    "amount": 450,
    "paymentMethod": "Card",
    "remarks": "Updated remark"
  }
}</code></pre>
        </div>
      </div>
    </section>

    <!-- Section: Admin Delete Payment -->
    <section id="admin-payment-delete" class="scroll-mt-20 space-y-5">
      <div class="border-b border-neutral-900 pb-3">
        <div class="flex items-center space-x-2.5">
          <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-semibold uppercase font-mono">DELETE</span>
          <h2 class="text-lg font-semibold text-neutral-50 font-mono">/v1/admin/enrollment-payments/:id</h2>
        </div>
        <p class="text-neutral-400 mt-1 text-xs">Destructively remove a payment record from the database. <span class="text-indigo-400 font-medium">Requires Admin role.</span></p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-5">
          <div class="bg-neutral-900/60 border border-neutral-850 rounded p-5 space-y-3.5">
            <h4 class="text-xs font-semibold text-neutral-300 uppercase tracking-wider">Playground</h4>
            <div>
              <label class="block text-[10px] text-neutral-400 mb-1">Payment ID to Delete (Integer)</label>
              <input id="paymentDeleteId" type="number" placeholder="e.g. 1" class="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 font-mono">
            </div>
            <button onclick="runPaymentDelete()" class="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-900/50 rounded text-xs font-medium transition shadow-sm">Delete Payment</button>
            <div id="paymentDeleteResponseWrapper" class="hidden space-y-1.5">
              <span class="text-[11px] text-neutral-500 font-medium">Response Status: <span id="paymentDeleteResponseCode" class="font-mono">200</span></span>
              <pre class="bg-neutral-950 p-3 rounded border border-neutral-855 max-h-52 overflow-y-auto text-xs font-mono"><code class="language-json text-neutral-300" id="paymentDeleteResponseJson"></code></pre>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Response Example</h3>
          <pre class="bg-neutral-900 border border-neutral-800/80 rounded p-4 text-xs"><code class="language-json">{
  "status": "success",
  "message": "Payment deleted successfully"
}</code></pre>
        </div>
      </div>
    </section>

  </main>

  <!-- Script for Interactive Playground & Menu -->
  <script>
    // Highlight JS bootup
    document.addEventListener('DOMContentLoaded', function() {
      hljs.highlightAll();
      updateTokenPlaceholder();
    });

    // Mobile Drawer Handlers
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');
    var mobileDrawer = document.getElementById('mobileDrawer');
    var closeDrawerBtn = document.getElementById('closeDrawerBtn');

    mobileMenuBtn.addEventListener('click', function() {
      mobileDrawer.classList.remove('hidden');
    });

    closeDrawerBtn.addEventListener('click', function() {
      mobileDrawer.classList.add('hidden');
    });

    // Clipboard Copy
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(function() {
        alert('Copied to clipboard!');
      });
    }

    // Token Utilities
    function saveToken(token) {
      localStorage.setItem('jwt_token', token);
      updateTokenPlaceholder();
      var indicator = document.getElementById('savedTokenIndicator');
      indicator.classList.remove('hidden');
      setTimeout(function() { indicator.classList.add('hidden'); }, 3000);
    }

    function clearToken() {
      localStorage.removeItem('jwt_token');
      updateTokenPlaceholder();
      alert('Token cleared from browser storage.');
    }

    function updateTokenPlaceholder() {
      var token = localStorage.getItem('jwt_token');
      var placeholder = document.getElementById('tokenPlaceholder');
      if (token) {
        placeholder.innerText = token;
        placeholder.classList.remove('text-neutral-500');
        placeholder.classList.add('text-green-400');
      } else {
        placeholder.innerText = '<token-missing>';
        placeholder.classList.remove('text-green-400');
        placeholder.classList.add('text-neutral-500');
      }
    }

    // Helper for formatting responses
    function displayResponse(wrapperId, codeId, jsonId, res, data) {
      var wrapper = document.getElementById(wrapperId);
      var codeEl = document.getElementById(codeId);
      var jsonEl = document.getElementById(jsonId);

      wrapper.classList.remove('hidden');
      codeEl.innerText = res.status + ' ' + res.statusText;
      codeEl.className = res.ok ? 'text-green-400 font-mono font-medium' : 'text-red-400 font-mono font-medium';
      
      jsonEl.innerText = JSON.stringify(data, null, 2);
      hljs.highlightElement(jsonEl);
    }

    // API Call: GET Health Check
    async function runHealthCheck() {
      var wrapper = document.getElementById('healthResponseWrapper');
      var codeEl = document.getElementById('healthResponseCode');
      var jsonEl = document.getElementById('healthResponseJson');
      
      wrapper.classList.remove('hidden');
      jsonEl.innerText = 'Loading response...';
      
      try {
        var res = await fetch('/v1');
        var data = await res.json();
        displayResponse('healthResponseWrapper', 'healthResponseCode', 'healthResponseJson', res, data);
      } catch (err) {
        codeEl.innerText = 'Failed';
        codeEl.className = 'text-red-400 font-mono font-medium';
        jsonEl.innerText = err.message;
      }
    }

    // API Call: POST Register
    async function runRegister() {
      var email = document.getElementById('regEmail').value;
      var password = document.getElementById('regPassword').value;
      var name = document.getElementById('regName').value;
      var mobile = document.getElementById('regMobile').value;

      if (!email || !password) {
        alert('Email and Password are required!');
        return;
      }

      document.getElementById('regResponseWrapper').classList.remove('hidden');
      document.getElementById('regResponseJson').innerText = 'Registering user...';

      try {
        var res = await fetch('/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password, name: name || undefined, mobile: mobile || undefined })
        });
        var data = await res.json();
        displayResponse('regResponseWrapper', 'regResponseCode', 'regResponseJson', res, data);
      } catch (err) {
        document.getElementById('regResponseCode').innerText = 'Failed';
        document.getElementById('regResponseJson').innerText = err.message;
      }
    }

    // API Call: POST Login
    async function runLogin() {
      var email = document.getElementById('loginEmail').value;
      var password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        alert('Email and Password are required!');
        return;
      }

      document.getElementById('loginResponseWrapper').classList.remove('hidden');
      document.getElementById('loginResponseJson').innerText = 'Logging in...';

      try {
        var res = await fetch('/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        });
        var data = await res.json();
        
        displayResponse('loginResponseWrapper', 'loginResponseCode', 'loginResponseJson', res, data);

        if (res.ok && data.data && data.data.token) {
          saveToken(data.data.token);
        }
      } catch (err) {
        document.getElementById('loginResponseCode').innerText = 'Failed';
        document.getElementById('loginResponseJson').innerText = err.message;
      }
    }

    // API Call: GET Profile (Me)
    async function runFetchProfile() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('No JWT Token found! Please log in first under the Login section.');
        return;
      }

      document.getElementById('meResponseWrapper').classList.remove('hidden');
      document.getElementById('meResponseJson').innerText = 'Fetching user profile...';

      try {
        var res = await fetch('/v1/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        var data = await res.json();
        displayResponse('meResponseWrapper', 'meResponseCode', 'meResponseJson', res, data);
      } catch (err) {
        document.getElementById('meResponseCode').innerText = 'Failed';
        document.getElementById('meResponseJson').innerText = err.message;
      }
    }

    // --- ADMIN API CALLS ---

    // GET /v1/admin/users
    async function runAdminSearch() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('No JWT Token found! Log in as an admin (e.g. aarav.sharma0@example.com) to query admin endpoints.');
        return;
      }

      var q = document.getElementById('adminSearchQ').value;
      var limit = document.getElementById('adminSearchLimit').value;
      var page = document.getElementById('adminSearchPage').value;

      document.getElementById('adminSearchResponseWrapper').classList.remove('hidden');
      document.getElementById('adminSearchResponseJson').innerText = 'Querying users...';

      try {
        var res = await fetch('/v1/admin/users?q=' + encodeURIComponent(q) + '&limit=' + limit + '&page=' + page, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('adminSearchResponseWrapper', 'adminSearchResponseCode', 'adminSearchResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminSearchResponseCode').innerText = 'Failed';
        document.getElementById('adminSearchResponseJson').innerText = err.message;
      }
    }

    // POST /v1/admin/users
    async function runAdminAddUser() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin JWT Token is required.');
        return;
      }

      var email = document.getElementById('adminAddEmail').value;
      var password = document.getElementById('adminAddPassword').value;
      var role = document.getElementById('adminAddRole').value;
      var status = document.getElementById('adminAddStatus').value;

      if (!email || !password) {
        alert('Email and Password are required!');
        return;
      }

      document.getElementById('adminAddResponseWrapper').classList.remove('hidden');
      document.getElementById('adminAddResponseJson').innerText = 'Adding user...';

      try {
        var res = await fetch('/v1/admin/users', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
          },
          body: JSON.stringify({ email: email, password: password, role: role, status: status })
        });
        var data = await res.json();
        displayResponse('adminAddResponseWrapper', 'adminAddResponseCode', 'adminAddResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminAddResponseCode').innerText = 'Failed';
        document.getElementById('adminAddResponseJson').innerText = err.message;
      }
    }

    // PUT /v1/admin/users/:id
    async function runAdminEditUser() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('adminEditId').value;
      if (!token || !id) {
        alert('Admin token and User UUID are required!');
        return;
      }

      var name = document.getElementById('adminEditName').value;
      var mobile = document.getElementById('adminEditMobile').value;
      var xp = document.getElementById('adminEditXp').value;
      var exp = document.getElementById('adminEditExp').value;

      var editBody = {};
      if (name) editBody.name = name;
      if (mobile) editBody.mobile = mobile;
      if (xp) editBody.xp = parseInt(xp, 10);
      if (exp) editBody.experienceYears = parseInt(exp, 10);

      document.getElementById('adminEditResponseWrapper').classList.remove('hidden');
      document.getElementById('adminEditResponseJson').innerText = 'Saving profile changes...';

      try {
        var res = await fetch('/v1/admin/users/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(editBody)
        });
        var data = await res.json();
        displayResponse('adminEditResponseWrapper', 'adminEditResponseCode', 'adminEditResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminEditResponseCode').innerText = 'Failed';
        document.getElementById('adminEditResponseJson').innerText = err.message;
      }
    }

    // PATCH /v1/admin/users/:id/role
    async function runUpdateRoleOnly() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('adminRoleUserId').value;
      var role = document.getElementById('adminRoleSelect').value;

      if (!token || !id) {
        alert('Admin token and User UUID are required!');
        return;
      }

      document.getElementById('adminRoleResponseWrapper').classList.remove('hidden');
      document.getElementById('adminRoleResponseJson').innerText = 'Updating user role...';

      try {
        var res = await fetch('/v1/admin/users/' + id + '/role', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ role: role })
        });
        var data = await res.json();
        displayResponse('adminRoleResponseWrapper', 'adminRoleResponseCode', 'adminRoleResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminRoleResponseCode').innerText = 'Failed';
        document.getElementById('adminRoleResponseJson').innerText = err.message;
      }
    }

    // PATCH /v1/admin/users/:id/status
    async function runUpdateStatusOnly() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('adminStatusUserId').value;
      var status = document.getElementById('adminStatusSelect').value;

      if (!token || !id) {
        alert('Admin token and User UUID are required!');
        return;
      }

      document.getElementById('adminStatusResponseWrapper').classList.remove('hidden');
      document.getElementById('adminStatusResponseJson').innerText = 'Updating user status...';

      try {
        var res = await fetch('/v1/admin/users/' + id + '/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ status: status })
        });
        var data = await res.json();
        displayResponse('adminStatusResponseWrapper', 'adminStatusResponseCode', 'adminStatusResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminStatusResponseCode').innerText = 'Failed';
        document.getElementById('adminStatusResponseJson').innerText = err.message;
      }
    }

    // DELETE /v1/admin/users/:id
    async function runDeleteUserOnly() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('adminDeleteUserId').value;

      if (!token || !id) {
        alert('Admin token and User UUID are required!');
        return;
      }

      if (!confirm('Are you absolutely sure you want to delete this user? This cannot be undone.')) {
        return;
      }

      document.getElementById('adminDeleteResponseWrapper').classList.remove('hidden');
      document.getElementById('adminDeleteResponseJson').innerText = 'Deleting user...';

      try {
        var res = await fetch('/v1/admin/users/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('adminDeleteResponseWrapper', 'adminDeleteResponseCode', 'adminDeleteResponseJson', res, data);
      } catch (err) {
        document.getElementById('adminDeleteResponseCode').innerText = 'Failed';
        document.getElementById('adminDeleteResponseJson').innerText = err.message;
      }
    }

    // --- ADMIN BATCH CRUD PLAYGROUND SCRIPTS ---

    // GET /v1/admin/batches
    async function runBatchSearch() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin JWT Token is required. Please log in first.');
        return;
      }
      var q = document.getElementById('batchSearchQ').value;
      var limit = document.getElementById('batchSearchLimit').value;
      var page = document.getElementById('batchSearchPage').value;

      document.getElementById('batchSearchResponseWrapper').classList.remove('hidden');
      document.getElementById('batchSearchResponseJson').innerText = 'Querying batches...';

      try {
        var res = await fetch('/v1/admin/batches?q=' + encodeURIComponent(q) + '&limit=' + limit + '&page=' + page, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('batchSearchResponseWrapper', 'batchSearchResponseCode', 'batchSearchResponseJson', res, data);
      } catch (err) {
        document.getElementById('batchSearchResponseCode').innerText = 'Failed';
        document.getElementById('batchSearchResponseJson').innerText = err.message;
      }
    }

    // GET /v1/admin/batches/:id
    async function runBatchGet() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('batchGetId').value;
      if (!token || !id) {
        alert('Admin token and Batch ID are required!');
        return;
      }

      document.getElementById('batchGetResponseWrapper').classList.remove('hidden');
      document.getElementById('batchGetResponseJson').innerText = 'Fetching batch details...';

      try {
        var res = await fetch('/v1/admin/batches/' + id, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('batchGetResponseWrapper', 'batchGetResponseCode', 'batchGetResponseJson', res, data);
      } catch (err) {
        document.getElementById('batchGetResponseCode').innerText = 'Failed';
        document.getElementById('batchGetResponseJson').innerText = err.message;
      }
    }

    // POST /v1/admin/batches
    async function runBatchCreate() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin token is required!');
        return;
      }
      var name = document.getElementById('batchCreateName').value;
      var slug = document.getElementById('batchCreateSlug').value;
      var topic = document.getElementById('batchCreateTopic').value;
      var price = document.getElementById('batchCreatePrice').value;
      var startDate = document.getElementById('batchCreateStartDate').value;
      var endDate = document.getElementById('batchCreateEndDate').value;
      var type = document.getElementById('batchCreateType').value;
      var status = document.getElementById('batchCreateStatus').value;

      if (!name || !startDate || !endDate) {
        alert('Name, Start Date, and End Date are required!');
        return;
      }

      document.getElementById('batchCreateResponseWrapper').classList.remove('hidden');
      document.getElementById('batchCreateResponseJson').innerText = 'Creating batch...';

      var body = {
        name: name,
        startDate: startDate,
        endDate: endDate,
        type: type,
        status: status
      };
      if (slug) body.slug = slug;
      if (topic) body.topic = topic;
      if (price) body.price = parseInt(price, 10);

      try {
        var res = await fetch('/v1/admin/batches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('batchCreateResponseWrapper', 'batchCreateResponseCode', 'batchCreateResponseJson', res, data);
      } catch (err) {
        document.getElementById('batchCreateResponseCode').innerText = 'Failed';
        document.getElementById('batchCreateResponseJson').innerText = err.message;
      }
    }

    // PUT /v1/admin/batches/:id
    async function runBatchUpdate() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('batchUpdateId').value;
      var name = document.getElementById('batchUpdateName').value;
      var price = document.getElementById('batchUpdatePrice').value;

      if (!token || !id) {
        alert('Admin token and Batch ID are required!');
        return;
      }

      document.getElementById('batchUpdateResponseWrapper').classList.remove('hidden');
      document.getElementById('batchUpdateResponseJson').innerText = 'Updating batch...';

      var body = {};
      if (name) body.name = name;
      if (price) body.price = parseInt(price, 10);

      try {
        var res = await fetch('/v1/admin/batches/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('batchUpdateResponseWrapper', 'batchUpdateResponseCode', 'batchUpdateResponseJson', res, data);
      } catch (err) {
        document.getElementById('batchUpdateResponseCode').innerText = 'Failed';
        document.getElementById('batchUpdateResponseJson').innerText = err.message;
      }
    }

    // DELETE /v1/admin/batches/:id
    async function runBatchDelete() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('batchDeleteId').value;

      if (!token || !id) {
        alert('Admin token and Batch ID are required!');
        return;
      }

      if (!confirm('Are you sure you want to delete this batch?')) {
        return;
      }

      document.getElementById('batchDeleteResponseWrapper').classList.remove('hidden');
      document.getElementById('batchDeleteResponseJson').innerText = 'Deleting batch...';

      try {
        var res = await fetch('/v1/admin/batches/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('batchDeleteResponseWrapper', 'batchDeleteResponseCode', 'batchDeleteResponseJson', res, data);
      } catch (err) {
        document.getElementById('batchDeleteResponseCode').innerText = 'Failed';
        document.getElementById('batchDeleteResponseJson').innerText = err.message;
      }
    }

    // --- ADMIN ENROLLMENT CRUD PLAYGROUND SCRIPTS ---

    // GET /v1/admin/enrollments
    async function runEnrollmentSearch() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin JWT Token is required.');
        return;
      }
      var q = document.getElementById('enrollmentSearchQ').value;
      var limit = document.getElementById('enrollmentSearchLimit').value;
      var page = document.getElementById('enrollmentSearchPage').value;

      document.getElementById('enrollmentSearchResponseWrapper').classList.remove('hidden');
      document.getElementById('enrollmentSearchResponseJson').innerText = 'Querying enrollments...';

      try {
        var res = await fetch('/v1/admin/enrollments?q=' + encodeURIComponent(q) + '&limit=' + limit + '&page=' + page, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('enrollmentSearchResponseWrapper', 'enrollmentSearchResponseCode', 'enrollmentSearchResponseJson', res, data);
      } catch (err) {
        document.getElementById('enrollmentSearchResponseCode').innerText = 'Failed';
        document.getElementById('enrollmentSearchResponseJson').innerText = err.message;
      }
    }

    // GET /v1/admin/enrollments/:id
    async function runEnrollmentGet() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('enrollmentGetId').value;
      if (!token || !id) {
        alert('Admin token and Enrollment ID are required!');
        return;
      }

      document.getElementById('enrollmentGetResponseWrapper').classList.remove('hidden');
      document.getElementById('enrollmentGetResponseJson').innerText = 'Fetching enrollment details...';

      try {
        var res = await fetch('/v1/admin/enrollments/' + id, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('enrollmentGetResponseWrapper', 'enrollmentGetResponseCode', 'enrollmentGetResponseJson', res, data);
      } catch (err) {
        document.getElementById('enrollmentGetResponseCode').innerText = 'Failed';
        document.getElementById('enrollmentGetResponseJson').innerText = err.message;
      }
    }

    // POST /v1/admin/enrollments
    async function runEnrollmentCreate() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin token is required!');
        return;
      }
      var userId = document.getElementById('enrollmentCreateUserId').value;
      var batchId = document.getElementById('enrollmentCreateBatchId').value;
      var amountPayable = document.getElementById('enrollmentCreateAmountPayable').value;
      var amountPaid = document.getElementById('enrollmentCreateAmountPaid').value;
      var type = document.getElementById('enrollmentCreateType').value;
      var paymentStatus = document.getElementById('enrollmentCreatePaymentStatus').value;

      if (!userId || !batchId) {
        alert('User UUID and Batch ID are required!');
        return;
      }

      document.getElementById('enrollmentCreateResponseWrapper').classList.remove('hidden');
      document.getElementById('enrollmentCreateResponseJson').innerText = 'Creating enrollment...';

      var body = {
        userId: userId,
        batchId: parseInt(batchId, 10),
        enrollmentType: type,
        paymentStatus: paymentStatus
      };
      if (amountPayable) body.amountPayable = parseInt(amountPayable, 10);
      if (amountPaid) body.amountPaid = parseInt(amountPaid, 10);

      try {
        var res = await fetch('/v1/admin/enrollments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('enrollmentCreateResponseWrapper', 'enrollmentCreateResponseCode', 'enrollmentCreateResponseJson', res, data);
      } catch (err) {
        document.getElementById('enrollmentCreateResponseCode').innerText = 'Failed';
        document.getElementById('enrollmentCreateResponseJson').innerText = err.message;
      }
    }

    // PUT /v1/admin/enrollments/:id
    async function runEnrollmentUpdate() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('enrollmentUpdateId').value;
      var status = document.getElementById('enrollmentUpdateStatus').value;
      var progress = document.getElementById('enrollmentUpdateProgress').value;
      var paymentStatus = document.getElementById('enrollmentUpdatePaymentStatus').value;
      var certId = document.getElementById('enrollmentUpdateCertId').value;
      var amountPayable = document.getElementById('enrollmentUpdateAmountPayable').value;

      if (!token || !id) {
        alert('Admin token and Enrollment ID are required!');
        return;
      }

      document.getElementById('enrollmentUpdateResponseWrapper').classList.remove('hidden');
      document.getElementById('enrollmentUpdateResponseJson').innerText = 'Updating enrollment...';

      var body = {};
      if (status !== '') body.status = parseInt(status, 10);
      if (progress !== '') body.progress = parseInt(progress, 10);
      if (paymentStatus) body.paymentStatus = paymentStatus;
      if (certId) body.certificateId = certId;
      if (amountPayable !== '') body.amountPayable = parseInt(amountPayable, 10);

      try {
        var res = await fetch('/v1/admin/enrollments/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('enrollmentUpdateResponseWrapper', 'enrollmentUpdateResponseCode', 'enrollmentUpdateResponseJson', res, data);
      } catch (err) {
        document.getElementById('enrollmentUpdateResponseCode').innerText = 'Failed';
        document.getElementById('enrollmentUpdateResponseJson').innerText = err.message;
      }
    }

    // DELETE /v1/admin/enrollments/:id
    async function runEnrollmentDelete() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('enrollmentDeleteId').value;

      if (!token || !id) {
        alert('Admin token and Enrollment ID are required!');
        return;
      }

      if (!confirm('Are you sure you want to delete this enrollment?')) {
        return;
      }

      document.getElementById('enrollmentDeleteResponseWrapper').classList.remove('hidden');
      document.getElementById('enrollmentDeleteResponseJson').innerText = 'Deleting enrollment...';

      try {
        var res = await fetch('/v1/admin/enrollments/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('enrollmentDeleteResponseWrapper', 'enrollmentDeleteResponseCode', 'enrollmentDeleteResponseJson', res, data);
      } catch (err) {
        document.getElementById('enrollmentDeleteResponseCode').innerText = 'Failed';
        document.getElementById('enrollmentDeleteResponseJson').innerText = err.message;
      }
    }

    // --- ENROLLMENT PAYMENTS API CALLS ---

    // GET /v1/admin/enrollment-payments
    async function runPaymentSearch() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin token is required!');
        return;
      }
      var q = document.getElementById('paymentSearchQ').value;
      var limit = document.getElementById('paymentSearchLimit').value;
      var page = document.getElementById('paymentSearchPage').value;

      document.getElementById('paymentSearchResponseWrapper').classList.remove('hidden');
      document.getElementById('paymentSearchResponseJson').innerText = 'Searching payments...';

      try {
        var res = await fetch('/v1/admin/enrollment-payments?q=' + encodeURIComponent(q) + '&limit=' + limit + '&page=' + page, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('paymentSearchResponseWrapper', 'paymentSearchResponseCode', 'paymentSearchResponseJson', res, data);
      } catch (err) {
        document.getElementById('paymentSearchResponseCode').innerText = 'Failed';
        document.getElementById('paymentSearchResponseJson').innerText = err.message;
      }
    }

    // GET /v1/admin/enrollment-payments/:id
    async function runPaymentGet() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('paymentGetId').value;
      if (!token || !id) {
        alert('Admin token and Payment ID are required!');
        return;
      }

      document.getElementById('paymentGetResponseWrapper').classList.remove('hidden');
      document.getElementById('paymentGetResponseJson').innerText = 'Fetching details...';

      try {
        var res = await fetch('/v1/admin/enrollment-payments/' + id, {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('paymentGetResponseWrapper', 'paymentGetResponseCode', 'paymentGetResponseJson', res, data);
      } catch (err) {
        document.getElementById('paymentGetResponseCode').innerText = 'Failed';
        document.getElementById('paymentGetResponseJson').innerText = err.message;
      }
    }

    // POST /v1/admin/enrollment-payments
    async function runPaymentCreate() {
      var token = localStorage.getItem('jwt_token');
      if (!token) {
        alert('Admin token is required!');
        return;
      }
      var enrollmentId = document.getElementById('paymentCreateEnrollmentId').value;
      var amount = document.getElementById('paymentCreateAmount').value;
      var paidAt = document.getElementById('paymentCreatePaidAt').value;
      var method = document.getElementById('paymentCreateMethod').value;
      var txId = document.getElementById('paymentCreateTxId').value;
      var invoiceId = document.getElementById('paymentCreateInvoiceId').value;
      var purpose = document.getElementById('paymentCreatePurpose').value;
      var remarks = document.getElementById('paymentCreateRemarks').value;

      if (!enrollmentId || !amount) {
        alert('Enrollment ID and Amount are required!');
        return;
      }

      document.getElementById('paymentCreateResponseWrapper').classList.remove('hidden');
      document.getElementById('paymentCreateResponseJson').innerText = 'Recording payment...';

      var body = {
        batchEnrollmentId: parseInt(enrollmentId, 10),
        amount: parseInt(amount, 10),
        paidAt: paidAt || new Date().toISOString(),
        paymentMethod: method || null,
        transactionId: txId || null,
        invoiceId: invoiceId || null,
        purpose: purpose,
        isGstApplicable: true,
        remarks: remarks || null
      };

      try {
        var res = await fetch('/v1/admin/enrollment-payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('paymentCreateResponseWrapper', 'paymentCreateResponseCode', 'paymentCreateResponseJson', res, data);
      } catch (err) {
        document.getElementById('paymentCreateResponseCode').innerText = 'Failed';
        document.getElementById('paymentCreateResponseJson').innerText = err.message;
      }
    }

    // PUT /v1/admin/enrollment-payments/:id
    async function runPaymentUpdate() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('paymentUpdateId').value;
      var amount = document.getElementById('paymentUpdateAmount').value;
      var method = document.getElementById('paymentUpdateMethod').value;
      var remarks = document.getElementById('paymentUpdateRemarks').value;

      if (!token || !id) {
        alert('Admin token and Payment ID are required!');
        return;
      }

      document.getElementById('paymentUpdateResponseWrapper').classList.remove('hidden');
      document.getElementById('paymentUpdateResponseJson').innerText = 'Updating payment...';

      var body = {};
      if (amount !== '') body.amount = parseInt(amount, 10);
      if (method) body.paymentMethod = method;
      if (remarks) body.remarks = remarks;

      try {
        var res = await fetch('/v1/admin/enrollment-payments/' + id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        var data = await res.json();
        displayResponse('paymentUpdateResponseWrapper', 'paymentUpdateResponseCode', 'paymentUpdateResponseJson', res, data);
      } catch (err) {
        document.getElementById('paymentUpdateResponseCode').innerText = 'Failed';
        document.getElementById('paymentUpdateResponseJson').innerText = err.message;
      }
    }

    // DELETE /v1/admin/enrollment-payments/:id
    async function runPaymentDelete() {
      var token = localStorage.getItem('jwt_token');
      var id = document.getElementById('paymentDeleteId').value;

      if (!token || !id) {
        alert('Admin token and Payment ID are required!');
        return;
      }

      if (!confirm('Are you sure you want to delete this payment record?')) {
        return;
      }

      document.getElementById('paymentDeleteResponseWrapper').classList.remove('hidden');
      document.getElementById('paymentDeleteResponseJson').innerText = 'Deleting payment...';

      try {
        var res = await fetch('/v1/admin/enrollment-payments/' + id, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        var data = await res.json();
        displayResponse('paymentDeleteResponseWrapper', 'paymentDeleteResponseCode', 'paymentDeleteResponseJson', res, data);
      } catch (err) {
        document.getElementById('paymentDeleteResponseCode').innerText = 'Failed';
        document.getElementById('paymentDeleteResponseJson').innerText = err.message;
      }
    }
  </script>
</body>
</html>`;
}
