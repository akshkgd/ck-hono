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
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-red-500/10 text-red-400 font-mono">DEL</span>
              <a href="#users-delete" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Delete user</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Batches</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#batches-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List batches</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#batches-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create batch</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#batches-get" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get batch</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-amber-500/10 text-amber-400 font-mono">PUT</span>
              <a href="#batches-update" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update batch</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-red-500/10 text-red-400 font-mono">DEL</span>
              <a href="#batches-delete" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Delete batch</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Batch Sections</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#sections-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List sections</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#sections-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create section</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#sections-get" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get section</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-amber-500/10 text-amber-400 font-mono">PUT</span>
              <a href="#sections-update" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update section</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-red-500/10 text-red-400 font-mono">DEL</span>
              <a href="#sections-delete" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Delete section</a>
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
              <a href="#enrollments-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Create enrollment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#enrollments-get" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get enrollment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-amber-500/10 text-amber-400 font-mono">PUT</span>
              <a href="#enrollments-update" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update enrollment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-red-500/10 text-red-400 font-mono">DEL</span>
              <a href="#enrollments-delete" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Delete enrollment</a>
            </li>
          </ul>
        </div>

        <div>
          <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Admin: Payments</div>
          <ul class="space-y-1.5 pl-2 border-l border-zinc-900 ml-1">
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#payments-search" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">List payments</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-blue-500/10 text-blue-400 font-mono">POST</span>
              <a href="#payments-create" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Log payment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-green-500/10 text-green-400 font-mono">GET</span>
              <a href="#payments-get" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Get payment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-amber-500/10 text-amber-400 font-mono">PUT</span>
              <a href="#payments-update" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Update payment</a>
            </li>
            <li class="flex items-center gap-2">
              <span class="text-[8px] font-bold px-1 rounded bg-red-500/10 text-red-400 font-mono">DEL</span>
              <a href="#payments-delete" class="block py-1 text-xs text-zinc-400 hover:text-indigo-400 transition font-mono truncate">Delete payment</a>
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
          <div class="text-zinc-200">https://api.codekaro.in/v1</div>
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
  id: string; // Default: uuid_generate_v4()
  email: string;
  name: string | null;
  mobile: string | null;
  avatarUrl: string | null;
  bio: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  occupationType: 'student' | 'professional' | 'academic' | 'other'; // Default: 'other'
  occupationTitle: string | null;
  organization: string | null;
  experienceYears: number | null;
  role: 'student' | 'admin' | 'user' | 'moderator'; // Default: 'student'
  status: 'active' | 'inactive' | 'suspended'; // Default: 'active'
  googleId: string | null;
  emailVerified: boolean; // Default: false
  xp: number; // Default: 0
  currentStreak: number; // Default: 0
  longestStreak: number; // Default: 0
  metadata: Record&lt;string, any&gt;; // Default: {}
  lastActiveAt: string; // Default: CURRENT_TIMESTAMP
  createdAt: string; // Default: CURRENT_TIMESTAMP
  updatedAt: string; // Default: CURRENT_TIMESTAMP
}

export interface Batch {
  id: number;
  topic: string | null;
  name: string;
  description: string | null;
  slug: string | null;
  price: number | null;
  certificateFee: number; // Default: 0
  limit: number | null; // Default: 0
  img: string | null;
  association: string | null;
  logo: string | null;
  type: 'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship'; // Default: 'cohort'
  startDate: string;
  endDate: string;
  whatsAppLink: string | null;
  telegramLink: string | null;
  telegramBroadcast: string | null;
  teacherId: string | null;
  teacherPayment: boolean; // Default: false
  meetingLink: string | null;
  nextClassTopic: string | null;
  desc: string | null;
  nextClass: string | null;
  status: 'active' | 'private' | 'completed'; // Default: 'private'
  metadata: Record&lt;string, any&gt;; // Default: {}
  accessTillDate: string | null;
  accessTillYear: number; // Default: 1
  createdAt: string | null; // Default: CURRENT_TIMESTAMP
  updatedAt: string | null; // Default: CURRENT_TIMESTAMP
}

export interface BatchEnrollment {
  id: number;
  userId: string;
  batchId: number;
  amountPayable: number | null;
  enrollmentType: 'oneTime' | 'Subscription' | 'free'; // Default: 'oneTime'
  status: number; // Default: 0 (Inactive)
  progress: number; // Default: 0
  timeSpentSeconds: number; // Default: 0
  amountPaid: number | null;
  certificateFee: number | null;
  paymentStatus: 'captured' | 'failed' | 'created' | 'refunded'; // Default: 'created'
  paymentMethod: string | null;
  couponCode: string | null;
  transactionId: string | null;
  invoiceId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: 'active' | 'expired' | 'pending' | null;
  subscriptionActiveOn: string | null;
  subscriptionExpiresOn: string | null;
  paidAt: string | null;
  certificateId: string | null;
  certificateGeneratedAt: string | null;
  startedAt: string | null;
  accessTill: string | null;
  overrideAccessDays: number | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  remark: string | null;
  metadata: Record&lt;string, any&gt;; // Default: {}
  createdAt: string; // Default: CURRENT_TIMESTAMP
  updatedAt: string; // Default: CURRENT_TIMESTAMP
}

export interface BatchSection {
  id: number;
  title: string;
  batchId: number | null;
  order: number | null;
  createdAt: string; // Default: CURRENT_TIMESTAMP
  updatedAt: string; // Default: CURRENT_TIMESTAMP
}

export interface BatchEnrollmentPayment {
  id: number;
  batchEnrollmentId: number;
  amount: number;
  paidAt: string;
  paymentMethod: string | null;
  transactionId: string | null;
  invoiceId: string | null;
  purpose: string; // Default: 'enrollment'
  isGstApplicable: boolean; // Default: true
  remarks: string | null;
  metadata: Record&lt;string, any&gt;; // Default: {}
  createdAt: string; // Default: CURRENT_TIMESTAMP
  updatedAt: string; // Default: CURRENT_TIMESTAMP
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
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Authentication</div>
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
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Authentication</div>
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
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Authentication</div>
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /auth/logout -->
        <div id="endpoint-logout" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Authentication</div>
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: USERS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/users -->
        <div id="users-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Users</div>
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
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal font-sans">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900 font-mono">Param</th><th class="p-2 border-r border-zinc-900 font-mono">Type</th><th class="p-2 border-r border-zinc-900 font-mono">Default</th><th class="p-2 font-mono">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">""</td><td class="p-2 text-zinc-400">Prefix filter matching name, email, or mobile.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">role</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">-</td><td class="p-2 text-zinc-400">Filter by user role: 'student' | 'admin' | 'user' | 'moderator'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">sortBy</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">'createdAt'</td><td class="p-2 text-zinc-400">Sort by field: 'createdAt' | 'name' | 'email' | 'xp' | 'lastActiveAt'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">sortOrder</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">'desc'</td><td class="p-2 text-zinc-400">Sort direction order: 'asc' | 'desc'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">limit</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">10</td><td class="p-2 text-zinc-400">Max page size (1 to 50).</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">page</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">1</td><td class="p-2 text-zinc-400">Offset pagination page multiplier.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/users?role=student&sortBy=createdAt&sortOrder=desc&limit=10&page=1', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/users -->
        <div id="users-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Users</div>
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
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left font-normal">
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/users', {
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
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/users/:id -->
        <div id="users-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Users</div>
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
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/users/8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1', {
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
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /admin/users/:id/details -->
        <div id="users-details" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get User Profile Details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Retrieves a student's comprehensive unified details profile. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/users/:id/details</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/users/8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1/details', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: DELETE /admin/users/:id -->
        <div id="users-delete" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Users</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Delete user</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Permanently deletes the user record matching the UUID in the URL path. All associated enrollments are deleted cascade-style, and teacher association fields are set to null. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">DELETE</span>
              <span class="text-zinc-200">/v1/admin/users/:id</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900 font-mono">Param</th><th class="p-2 border-r border-zinc-900 font-mono">Type</th><th class="p-2 border-r border-zinc-900 font-mono">Required</th><th class="p-2 font-mono">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Numerical database ID of the batch.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/users/8a329d5b-f35f-4a0b-9dfa-c529d45e0fb1', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">Response Payload (200 OK)</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>{
  "status": "success",
  "message": "User deleted successfully"
}</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- -------------------- ADMIN: BATCHES GROUP -------------------- -->

        <!-- Endpoint: GET /admin/batches -->
        <div id="batches-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List and Filter Batches</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Searches course batches using text keywords or type/status enums. Requires Admin Role.
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
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 text-zinc-400">Filter matches name, topic, or slug.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">type</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 text-zinc-400">'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 text-zinc-400">'active' | 'private' | 'completed'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batches?type=cohort&status=active', {
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
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create new batch</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Creates a new batch cohort course record. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/batches</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <div class="max-h-[300px] overflow-y-auto border border-zinc-900 rounded-lg custom-scrollbar">
                <table class="w-full text-xs border-collapse text-left font-normal">
                  <thead>
                    <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono sticky top-0"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">name</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch identifier name.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">startDate</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">YYYY-MM-DD start date.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">endDate</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">YYYY-MM-DD end date.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">topic</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Category topic description.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">description</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Detailed course content.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">slug</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Unique URL identifier slug.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">price</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Base pricing amount.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">certificateFee</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Certificate pricing (Default 0).</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">limit</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Registration limit (Default 0).</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">type</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'cohort' | 'live' | 'webinar' | 'callBooking' | 'mentorship' (Default 'cohort')</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">whatsAppLink</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">WhatsApp invite link.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">telegramLink</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Telegram group link.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">telegramBroadcast</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Telegram channel link.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">teacherId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Teacher user UUID.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">teacherPayment</td><td class="p-2 border-r border-zinc-900 text-zinc-400">boolean</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Teacher payment active (Default false).</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">meetingLink</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Class meeting link.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">nextClassTopic</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Next class title.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">desc</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Alternate description.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">nextClass</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">ISO Date string for next class.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">status</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'active' | 'private' | 'completed' (Default 'private')</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">metadata</td><td class="p-2 border-r border-zinc-900 text-zinc-400">object</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">JSON Key-Value record (Default {}).</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">accessTillDate</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">YYYY-MM-DD access expiry.</td></tr>
                    <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">accessTillYear</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Access duration years (Default 1).</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batches', {
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

        <!-- Endpoint: GET /admin/batches/:id -->
        <div id="batches-get" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get batch details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Retrieves the complete profile data of a single course batch cohort by its ID. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/batches/:id</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">The unique database numerical ID of the batch.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batches/4', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/batches/:id -->
        <div id="batches-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update batch</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates specific parameters on a batch. Only the fields present in the JSON body will be validated and updated in the database. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">PUT</span>
              <span class="text-zinc-200">/v1/admin/batches/:id</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">The database ID of the batch.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batches/4', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    name: 'Next.js Advanced Workshop',
    price: 3499
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: DELETE /admin/batches/:id -->
        <div id="batches-delete" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batches</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Delete batch</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Deletes a batch cohort course record from the database. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">DELETE</span>
              <span class="text-zinc-200">/v1/admin/batches/:id</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Path Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">id</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Numerical database ID of the batch.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batches/4', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: BATCH SECTIONS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/batch-sections -->
        <div id="sections-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batch Sections</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List curriculum sections</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Searches and lists sections headers mapping to batch courses. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/batch-sections</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Query Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900">Param</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 text-zinc-400">Keyword filter matching title.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 text-zinc-400">Numerical ID of the batch.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batch-sections?batchId=4', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/batch-sections -->
        <div id="sections-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batch Sections</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create section</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Adds a curriculum segment section header. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/batch-sections</span>
            </div>
            
            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left font-normal font-sans">
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batch-sections', {
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

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /admin/batch-sections/:id -->
        <div id="sections-get" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batch Sections</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get section details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Retrieves profile details of a single section header by its database ID. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/batch-sections/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batch-sections/12', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/batch-sections/:id -->
        <div id="sections-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batch Sections</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update section</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates specific properties on a batch section. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">PUT</span>
              <span class="text-zinc-200">/v1/admin/batch-sections/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batch-sections/12', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    title: 'Updated Section Name',
    order: 2
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: DELETE /admin/batch-sections/:id -->
        <div id="sections-delete" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Batch Sections</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Delete section</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Permanently deletes a batch curriculum section from the database. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">DELETE</span>
              <span class="text-zinc-200">/v1/admin/batch-sections/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/batch-sections/12', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: ENROLLMENTS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/enrollments -->
        <div id="enrollments-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List Enrollments</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Queries registered student enrollments list with pagination. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollments</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Query Parameters</div>
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal font-sans">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900"><th class="p-2 border-r border-zinc-900 font-mono">Param</th><th class="p-2 border-r border-zinc-900 font-mono">Type</th><th class="p-2 border-r border-zinc-900 font-mono">Default</th><th class="p-2 font-mono">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">q</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-zinc-500">""</td><td class="p-2 text-zinc-400">Filter matches name, email, couponCode, or transactionId.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">-</td><td class="p-2 text-zinc-400">Filter by numerical ID of the batch course.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">paymentStatus</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">-</td><td class="p-2 text-zinc-400">Filter by payment status: 'captured' | 'failed' | 'created' | 'refunded'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">sortBy</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">'createdAt'</td><td class="p-2 text-zinc-400">Sort by field: 'createdAt' | 'progress' | 'amountPaid' | 'timeSpentSeconds'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">sortOrder</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">'desc'</td><td class="p-2 text-zinc-400">Sort direction order: 'asc' | 'desc'</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">limit</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">10</td><td class="p-2 text-zinc-400">Max page size (1 to 50).</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 text-zinc-300">page</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">1</td><td class="p-2 text-zinc-400">Offset pagination page multiplier.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollments?paymentStatus=captured&sortBy=createdAt&sortOrder=desc&limit=10&page=1', {
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
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Create new enrollment</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Enrolls a student inside a course batch. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/enrollments</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left font-normal font-sans">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">userId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string (UUID)</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Student User UUID.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Batch numerical ID.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">amountPayable</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">Total pricing.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">enrollmentType</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'oneTime' | 'Subscription' | 'free'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollments', {
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

        <!-- Endpoint: GET /admin/enrollments/:id -->
        <div id="enrollments-get" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get enrollment details</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Retrieves the profile fields of a single enrollment record by its ID. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollments/48', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/enrollments/:id -->
        <div id="enrollments-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update enrollment</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates tracking fields (progress percentage, time spent) or payment status for a student enrollment. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">PUT</span>
              <span class="text-zinc-200">/v1/admin/enrollments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollments/48', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    progress: 80,
    timeSpentSeconds: 18000,
    paymentStatus: 'captured'
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: DELETE /admin/enrollments/:id -->
        <div id="enrollments-delete" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Enrollments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Delete enrollment</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Removes student registration from the batch course. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">DELETE</span>
              <span class="text-zinc-200">/v1/admin/enrollments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollments/48', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>


        <!-- -------------------- ADMIN: PAYMENTS GROUP -------------------- -->

        <!-- Endpoint: GET /admin/payments -->
        <div id="payments-search" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">List payment transactions</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Queries billing transaction receipts logs with text and key filters. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollment-payments', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: POST /admin/payments -->
        <div id="payments-create" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Log payment transaction</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Logs a new transaction receipt mapping to student course enrollment. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">POST</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments</span>
            </div>

            <div class="space-y-2 pt-4">
              <div class="text-xs uppercase font-bold text-zinc-500 font-mono">Body Fields (JSON)</div>
              <table class="w-full text-xs border-collapse border border-zinc-900 text-left font-normal font-sans">
                <thead>
                  <tr class="bg-zinc-900/50 text-zinc-400 border-b border-zinc-900 font-mono"><th class="p-2 border-r border-zinc-900">Field</th><th class="p-2 border-r border-zinc-900">Type</th><th class="p-2 border-r border-zinc-900">Required</th><th class="p-2">Description</th></tr>
                </thead>
                <tbody>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">batchEnrollmentId</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">ID of the enrollment.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">amount</td><td class="p-2 border-r border-zinc-900 text-zinc-400">number</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">Price paid.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">paidAt</td><td class="p-2 border-r border-zinc-900 text-zinc-400">string</td><td class="p-2 border-r border-zinc-900 text-indigo-400">Yes</td><td class="p-2 text-zinc-400">ISO Date string of transaction.</td></tr>
                  <tr class="border-b border-zinc-900"><td class="p-2 border-r border-zinc-900 font-mono text-zinc-300">purpose</td><td class="p-2 border-r border-zinc-900 text-zinc-400">enum</td><td class="p-2 border-r border-zinc-900 text-zinc-500">No</td><td class="p-2 text-zinc-400">'enrollment', 'renewal', 'certificate', 'upgrade', 'refund'</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollment-payments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    batchEnrollmentId: 48,
    amount: 1999,
    paidAt: '2026-06-30T12:00:00.000Z',
    purpose: 'enrollment'
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: GET /admin/payments/:id -->
        <div id="payments-get" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Get payment transaction</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Gets details of a logged payment audit record by its ID. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-green-500/10 text-green-400 font-bold">GET</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollment-payments/5', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  }
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: PUT /admin/payments/:id -->
        <div id="payments-update" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Update payment transaction</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Updates select fields of a transaction log. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">PUT</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollment-payments/5', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
  },
  body: JSON.stringify({
    remarks: 'Stripe webhook payment settled.'
  })
});</code></pre>
            </div>
          </div>
        </div>

        <hr class="border-zinc-900" />

        <!-- Endpoint: DELETE /admin/payments/:id -->
        <div id="payments-delete" class="scroll-mt-24 grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div class="xl:col-span-3 space-y-4">
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Admin: Payments</div>
            <h3 class="text-2xl font-semibold text-zinc-100">Delete payment transaction</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Removes the transaction log record. Requires Admin Role.
            </p>
            <div class="flex items-center gap-2 border border-zinc-900 bg-zinc-950 p-2 rounded-lg text-xs font-mono max-w-xl">
              <span class="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">DELETE</span>
              <span class="text-zinc-200">/v1/admin/enrollment-payments/:id</span>
            </div>
          </div>

          <div class="xl:col-span-2 space-y-6">
            <div class="space-y-1">
              <div class="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">JavaScript Request Code</div>
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/enrollment-payments/5', {
  method: 'DELETE',
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
            <div class="text-xs text-indigo-400 font-mono tracking-wider font-semibold uppercase font-mono">Diagnostics</div>
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
              <table class="w-full text-xs font-mono border-collapse border border-zinc-900 text-left font-normal">
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
              <pre class="bg-zinc-900 border border-zinc-900 p-4 rounded-lg text-xs font-mono text-zinc-300 overflow-x-auto"><code>const response = await fetch('https://api.codekaro.in/v1/admin/logs/data?file=app-2026-06-28.log&level=error', {
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
