import { ep, html, p, SAMPLE, section, type Page } from '../kit.js';
import { jsonBlock } from '../layout.js';

const sessionUser = {
  id: SAMPLE.uuid,
  email: 'student@example.com',
  name: 'Asha Verma',
  role: 'student',
  status: 'active',
  avatarUrl: null,
  mobile: '+919876543210',
  bio: null,
  linkedinUrl: null,
  githubUrl: null,
  occupationType: 'student',
  occupationTitle: null,
  organization: null,
  experienceYears: null,
  xp: 120,
  currentStreak: 3,
  longestStreak: 9,
  lastActiveAt: SAMPLE.iso,
};

const card = (href: string, title: string, desc: string) =>
  `<a href="${href}" class="block rounded-lg border border-slate-200 p-4 transition hover:border-indigo-400 hover:shadow-sm dark:border-slate-800 dark:hover:border-indigo-500"><div class="font-medium text-slate-900 dark:text-slate-100">${title}</div><div class="mt-1 text-sm text-slate-500 dark:text-slate-400">${desc}</div></a>`;

export const home: Page = {
  path: '',
  title: 'Overview',
  group: 'Getting started',
  summary: 'Reference for the Codekaro backend API: every route, request shape, response and operational detail, generated from the current source.',
  items: [
    html(`
<div class="grid gap-3 sm:grid-cols-2">
  ${card('/docs/v2/getting-started', 'Getting started', 'Base URL, versioning, CORS, headers, conventions.')}
  ${card('/docs/v2/auth', 'Authentication', 'Email OTP and password sign-in, sessions, bearer tokens.')}
  ${card('/docs/v2/errors', 'Errors', 'Response envelope, validation errors, status codes.')}
  ${card('/docs/v2/student/courses', 'Student APIs', 'Courses, content access, progress heartbeats, assignments.')}
  ${card('/docs/v2/payments/razorpay', 'Payments', 'Razorpay order, verify and webhook flow.')}
  ${card('/docs/v2/admin/users', 'Admin APIs', 'Users, batches, content, enrollments, reports, tooling.')}
  ${card('/docs/v2/reference/access-control', 'Access control', 'Which routes require auth, and which currently do not.')}
  ${card('/docs/v2/reference/database', 'Database', 'Tables, columns and enums.')}
</div>`),
    section('at-a-glance', 'At a glance', `
<ul>
  <li><strong>Stack:</strong> Hono on Node, PostgreSQL via Drizzle, Better Auth for sessions, BullMQ + Redis for background jobs.</li>
  <li><strong>Base URL:</strong> <code class="ic">https://api.codekaro.in/v1</code> (the same router is also served at <code class="ic">/api</code>).</li>
  <li><strong>Roles:</strong> <code class="ic">student</code> (default) and <code class="ic">admin</code> are the ones the API acts on. The role enum also has <code class="ic">user</code>, <code class="ic">moderator</code> and <code class="ic">teacher</code>.</li>
  <li><strong>Legacy docs:</strong> the old single-page reference is still available at <a href="/docs">/docs</a>, but it still describes <code class="ic">/v1/auth/register</code> and <code class="ic">/v1/auth/login</code>, which no longer exist. Use these pages instead.</li>
</ul>`),
  ],
};

export const gettingStarted: Page = {
  path: 'getting-started',
  title: 'Getting started',
  group: 'Getting started',
  summary: 'Everything a client needs before calling the first endpoint.',
  items: [
    section('base-url', 'Base URL and versioning', `
<p>All JSON endpoints live under <code class="ic">/v1</code>. The same router is also mounted at <code class="ic">/api</code>, which exists for older clients; new code should use <code class="ic">/v1</code>.</p>
<div class="tablewrap"><table>
<thead><tr><th>Route</th><th>Notes</th></tr></thead>
<tbody>
<tr><td><code class="ic">/v1/*</code> and <code class="ic">/api/*</code></td><td>The versioned API.</td></tr>
<tr><td><code class="ic">/v1/auth/*</code> and <code class="ic">/api/auth/*</code></td><td>Better Auth. <code class="ic">/v1/auth</code> is rewritten to <code class="ic">/api/auth</code> internally.</td></tr>
<tr><td><code class="ic">/health</code>, <code class="ic">/v1/health</code></td><td>Health checks, no auth.</td></tr>
<tr><td><code class="ic">/migration/*</code></td><td>Legacy migration endpoints (also mounted at <code class="ic">/v1/migration</code>).</td></tr>
<tr><td><code class="ic">/docs</code>, <code class="ic">/docs/v2</code>, <code class="ic">/playground</code>, <code class="ic">/changelog</code>, <code class="ic">/student-docs</code></td><td>HTML pages.</td></tr>
<tr><td><code class="ic">/admin/logs</code>, <code class="ic">/admin/terminal</code>, <code class="ic">/admin/fix-enrollment-totals</code>, <code class="ic">/migration-status</code></td><td>Server-rendered admin tools. The API calls they make are listed under <a href="/docs/v2/admin/logs">Logs</a>, <a href="/docs/v2/admin/terminal">Terminal</a> and <a href="/docs/v2/admin/course-progress">Course progress</a>.</td></tr>
</tbody></table></div>`),
    section('requests', 'Making requests', `
<ul>
  <li>Send and receive <code class="ic">application/json</code>. Responses are gzip-compressed when the client accepts it.</li>
  <li>IDs are UUIDs. Date-only fields use <code class="ic">YYYY-MM-DD</code>; timestamps are ISO 8601 in UTC.</li>
  <li>Money is an <strong>integer number of rupees</strong> everywhere in this API. Razorpay works in paise, and the conversion (×100 / ÷100) happens inside the payment service.</li>
  <li>Authenticated calls accept either the Better Auth session cookie (<code class="ic">credentials: 'include'</code>) or <code class="ic">Authorization: Bearer &lt;session token&gt;</code>. See <a href="/docs/v2/auth">Authentication</a>.</li>
  <li>Every response carries an <code class="ic">X-Request-Id</code> header. Quote it when reporting a problem; 500 responses also include it in the body as <code class="ic">requestId</code>.</li>
</ul>`),
    section('cors', 'CORS', `
<p>Browser calls are allowed from these origins, with credentials:</p>
<ul>
  <li><code class="ic">https://app.codekaro.in</code>, <code class="ic">https://codekaro.in</code>, <code class="ic">https://codekaro.pages.dev</code></li>
  <li><code class="ic">https://live.codekaro.in</code> and <code class="ic">http://live.codekaro.in</code></li>
  <li><code class="ic">http://localhost:3000</code> and <code class="ic">http://localhost:5173</code> for local development</li>
</ul>
<p>Any other origin is answered with <code class="ic">Access-Control-Allow-Origin: https://app.codekaro.in</code>, so the browser blocks it. Preflight responses are cacheable for 24 hours (<code class="ic">Access-Control-Max-Age: 86400</code>; browsers cap this lower).</p>`),
    section('rate-limits', 'Rate limits', `
<ul>
  <li>Better Auth routes: <strong>10 requests per minute per IP</strong> (in-memory counter, so it is per server process).</li>
  <li>Email OTP routes: <strong>20 requests per minute</strong>.</li>
  <li>No global rate limit is applied to the rest of the API.</li>
</ul>`),
    section('side-effects', 'Side effects of calling the API', `
<ul>
  <li><strong>Streaks and activity.</strong> Any authenticated request under <code class="ic">/v1</code> updates the user's <code class="ic">lastActiveAt</code> and daily streak, throttled to once per 15 minutes per user through a Redis lock. See <a href="/docs/v2/reference/architecture">Architecture</a>.</li>
  <li><strong>Emails are queued, never sent inline.</strong> Enrollment, payment and grading flows add jobs to BullMQ; the worker process delivers them.</li>
  <li><strong>Session location.</strong> Country and city are stored on the session from <code class="ic">cf-ipcountry</code> / <code class="ic">cf-ipcity</code> (or <code class="ic">x-country</code>, <code class="ic">x-city</code>) headers.</li>
</ul>`),
    section('conventions', 'Conventions used on these pages', `
<ul>
  <li>The badge next to each endpoint shows who may call it: <strong>Public</strong>, <strong>Optional auth</strong>, <strong>Signed-in user</strong>, <strong>Admin only</strong>, <strong>Webhook</strong>, or <strong>No auth (!)</strong> for admin-styled routes that are not actually protected.</li>
  <li>Paths in <span class="text-indigo-600 dark:text-indigo-300">:colour</span> are path parameters.</li>
  <li>Sample values are illustrative. Field names, types and validation rules come from the Zod schemas in the code.</li>
  <li>Use the search box (press <kbd>/</kbd>) to jump to any endpoint by name or path.</li>
</ul>`),
  ],
};

export const errors: Page = {
  path: 'errors',
  title: 'Errors',
  group: 'Getting started',
  summary: 'How failures are reported, and the status codes each kind of endpoint uses.',
  items: [
    section('envelope', 'Response envelope', `
<p>Most JSON endpoints answer with a <code class="ic">status</code> field.</p>
${jsonBlock({ status: 'success', message: 'Optional human readable note', data: {} }, 'Success')}
${jsonBlock({ status: 'error', message: 'What went wrong' }, 'Error')}
<div class="callout"><strong>Two other shapes exist.</strong> The email endpoints, email settings and migration queue endpoints use <code class="ic">{ "success": true, "data": ... }</code> instead. The health endpoints return the health object directly. These are called out on their own pages.</div>`),
    section('validation', 'Validation errors', `
<p>Validation failures come back as <strong>400</strong>, but the body depends on where the schema runs:</p>
<ol>
  <li><strong>Route-level validator</strong> (most create/update endpoints that use <code class="ic">zValidator</code>): the Zod error is returned as-is.</li>
</ol>
${jsonBlock({ success: false, error: { name: 'ZodError', message: '[ { "path": ["email"], "message": "Invalid email address" } ]' } }, 'Route-level validator')}
<ol start="2">
  <li><strong>Controller-level parse</strong> (many admin search/get/update endpoints call <code class="ic">schema.parse()</code> inside a try/catch): the error is flattened into the standard envelope, with the Zod message as a string.</li>
</ol>
${jsonBlock({ status: 'error', message: '[ { "origin": "string", "code": "invalid_format", "path": ["email"], "message": "Invalid email address" } ]' }, 'Controller-level parse')}
<p>Client code should therefore treat any <code class="ic">400</code> as "show the message", and only try to read <code class="ic">error.message</code> if <code class="ic">success === false</code>.</p>`),
    section('codes', 'Status codes', `
<div class="tablewrap"><table>
<thead><tr><th>Code</th><th>Meaning here</th></tr></thead>
<tbody>
<tr><td><code class="ic">200</code></td><td>Success. Also used for updates and deletes.</td></tr>
<tr><td><code class="ic">201</code></td><td>Created: batches, content library items, sections, live sessions, bug reports, users, enrollments, Razorpay orders.</td></tr>
<tr><td><code class="ic">202</code></td><td>Accepted: an email or queue job was enqueued.</td></tr>
<tr><td><code class="ic">400</code></td><td>Bad input <strong>and</strong> most business-rule failures (not found, duplicate, not allowed). Most controllers catch every thrown error and return 400 with the message.</td></tr>
<tr><td><code class="ic">401</code></td><td>Missing or expired session, or the user no longer exists.</td></tr>
<tr><td><code class="ic">403</code></td><td>Signed in but not allowed: not an admin, no captured payment for the course, or the free-form terminal is disabled.</td></tr>
<tr><td><code class="ic">404</code></td><td>Used by the public endpoints, migration status lookup, and unmatched routes (<code class="ic">Route not found</code>).</td></tr>
<tr><td><code class="ic">409</code></td><td>Terminal only: another command is still running.</td></tr>
<tr><td><code class="ic">500</code></td><td>Unhandled error: <code class="ic">{ "status": "error", "message": "Internal Server Error", "requestId": "..." }</code>.</td></tr>
<tr><td><code class="ic">503</code></td><td>Health endpoints when the service is not <code class="ic">operational</code>.</td></tr>
</tbody></table></div>
<div class="callout"><strong>"Not found" is usually 400.</strong> For example <code class="ic">GET /v1/admin/batches/:id</code> with an unknown id returns 400 with <code class="ic">Batch not found</code>. Only the public endpoints return 404. Match on <code class="ic">message</code> if you need to tell the cases apart.</div>`),
    section('auth-errors', 'Authentication errors', `
${jsonBlock({ status: 'error', message: 'Unauthorized: Session missing or expired' }, '401')}
${jsonBlock({ status: 'error', message: 'Forbidden: Admin access required' }, '403')}
<p>Other 401 messages: <code class="ic">Unauthorized: User does not exist</code>, <code class="ic">Unauthorized: Invalid authentication session</code>, <code class="ic">Unauthorized: Authentication required</code>.</p>`),
  ],
};

export const auth: Page = {
  path: 'auth',
  title: 'Authentication',
  group: 'Getting started',
  summary: 'Sessions are handled by Better Auth. Users sign in with an emailed one-time code or an email and password.',
  items: [
    section('how-it-works', 'How sessions work', `
<ul>
  <li>Signing in creates a <strong>server-side session</strong> (30-day lifetime, refreshed daily) stored in the <code class="ic">session</code> table. There is no JWT and no refresh-token flow.</li>
  <li>The browser receives a <code class="ic">better-auth.session_token</code> cookie. Non-browser clients can send the same token as <code class="ic">Authorization: Bearer &lt;token&gt;</code> (the Better Auth <code class="ic">bearer</code> plugin is enabled).</li>
  <li>The sign-in response includes the session token, and the <code class="ic">set-auth-token</code> response header also carries it.</li>
  <li><strong>Role and status are always read from the database</strong>, not from the cookie, so changing a user's role takes effect on their next request.</li>
  <li>The default sign-in is a <strong>4-digit email OTP</strong>. Passwords are supported through Better Auth's email and password flow.</li>
  <li>A student who completes a Razorpay payment is signed in automatically (<a href="/docs/v2/payments/razorpay">Payments</a>).</li>
</ul>
<div class="callout warn"><strong>Removed endpoints.</strong> <code class="ic">POST /v1/auth/register</code>, <code class="ic">POST /v1/auth/login</code> and the Redis refresh-token flow described in the legacy docs are gone. Calls to those paths fall through to Better Auth and fail.</div>`),
    section('better-auth', 'Better Auth endpoints', `
<p>Better Auth owns every route below <code class="ic">/v1/auth</code> that is not listed in the next section. The ones the product uses are documented here; Better Auth's own reference covers the rest (change password, social sign-in, etc.).</p>`),
    ep({
      id: 'send-otp',
      method: 'POST',
      path: '/auth/email-otp/send-verification-otp',
      access: 'public',
      title: 'Send a sign-in code',
      desc: 'Emails a 4-digit one-time code to the address. The email is queued through the email worker with the subject "<code> is your Codekaro Verification Code".',
      body: [
        p('email', 'string', 'required', 'Email address to send the code to.'),
        p('type', "'sign-in' | 'email-verification' | 'forget-password'", 'required', 'Use `sign-in` for logging in.'),
      ],
      bodyExample: { email: 'student@example.com', type: 'sign-in' },
      response: { status: 200, example: { success: true } },
      notes: [
        'Rate limited to 20 requests per minute. The email is queued, so delivery depends on the worker process.',
        '**The code expires after 5 minutes and allows 3 wrong attempts** (Better Auth defaults; no override is configured). The email body says "Valid for 10 minutes", which is inaccurate.',
      ],
      errors: [[400, 'Invalid email or request body (Better Auth message).'], [429, 'Rate limit exceeded.']],
    }),
    ep({
      id: 'sign-in-otp',
      method: 'POST',
      path: '/auth/sign-in/email-otp',
      access: 'public',
      title: 'Sign in with a code',
      desc: 'Exchanges the emailed code for a session. Creates the user on first sign-in if the account does not exist.',
      body: [
        p('email', 'string', 'required', 'Same address the code was sent to.'),
        p('otp', 'string', 'required', 'The 4-digit code.'),
      ],
      bodyExample: { email: 'student@example.com', otp: '4821' },
      response: {
        status: 200,
        example: { token: 'q8v...session-token', user: { id: SAMPLE.uuid, email: 'student@example.com', name: null, role: 'student' } },
        note: 'Also sets the `better-auth.session_token` cookie and a `set-auth-token` header.',
      },
      errors: [[400, 'Invalid or expired OTP.'], [429, 'Rate limit exceeded.']],
    }),
    ep({
      id: 'sign-up-email',
      method: 'POST',
      path: '/auth/sign-up/email',
      access: 'public',
      title: 'Sign up with email and password',
      desc: 'Better Auth email and password registration.',
      body: [
        p('email', 'string', 'required', 'Email address.'),
        p('password', 'string', 'required', 'Password (Better Auth default minimum length applies).'),
        p('name', 'string', 'required', 'Display name.'),
      ],
      bodyExample: { email: 'student@example.com', password: 'a-strong-password', name: 'Asha Verma' },
      response: { status: 200, example: { token: '...', user: { id: SAMPLE.uuid, email: 'student@example.com', name: 'Asha Verma' } } },
    }),
    ep({
      id: 'sign-in-email',
      method: 'POST',
      path: '/auth/sign-in/email',
      access: 'public',
      title: 'Sign in with email and password',
      desc: 'Better Auth email and password sign-in.',
      body: [p('email', 'string', 'required', 'Email address.'), p('password', 'string', 'required', 'Password.')],
      bodyExample: { email: 'student@example.com', password: 'a-strong-password' },
      response: { status: 200, example: { token: '...', user: { id: SAMPLE.uuid, email: 'student@example.com' } } },
    }),
    ep({
      id: 'sign-out',
      method: 'POST',
      path: '/auth/sign-out',
      access: 'user',
      title: 'Sign out',
      desc: 'Ends the current session and clears the cookie.',
      response: { status: 200, example: { success: true } },
    }),
    section('session-endpoints', 'Session helper endpoints', `<p>These are implemented by the Codekaro API itself (not Better Auth) and always read the latest profile from the database.</p>`),
    ep({
      id: 'get-session',
      method: 'GET',
      path: '/auth/get-session',
      access: 'public',
      title: 'Get current session',
      desc: 'Fast session check for app load. Never returns 401: when there is no valid session both fields are `null`. `/v1/auth/session` is an alias.',
      response: {
        status: 200,
        example: { user: sessionUser, session: { id: SAMPLE.uuid2, token: 'q8v...', expiresAt: '2026-12-12T09:30:00.000Z' } },
        note: 'With no session: `{ "user": null, "session": null }`.',
      },
    }),
    ep({
      id: 'me',
      method: 'GET',
      path: '/auth/me',
      access: 'user',
      title: 'Get my profile',
      desc: 'Returns the signed-in user merged with the latest database profile, plus the session object.',
      response: {
        status: 200,
        example: { status: 'success', data: { user: sessionUser, session: { id: SAMPLE.uuid2, token: 'q8v...', expiresAt: '2026-12-12T09:30:00.000Z' } } },
      },
      errors: [[401, 'Session missing, expired, or user deleted.']],
    }),
    ep({
      id: 'debug-session',
      method: 'GET',
      path: '/auth/debug-session',
      access: 'public',
      title: 'Debug session and location headers',
      desc: 'Diagnostic endpoint. Echoes the client IP, detected country and city, the location headers received, the active session if any, and **every request header**. Intended for debugging Cloudflare header forwarding.',
      notes: ['Public and verbose: the response includes all request headers, including `Authorization` and `Cookie` if sent. It also writes the payload to the server log. Do not call it from production client code.'],
      response: {
        status: 200,
        example: {
          status: 'success',
          data: {
            timestamp: SAMPLE.iso,
            clientIp: '203.0.113.7',
            detectedLocation: { country: 'IN', city: 'Pune' },
            locationHeaders: { 'cf-ipcountry': 'IN', 'cf-ipcity': 'Pune' },
            activeSession: null,
            user: null,
            allHeaders: { host: 'api.codekaro.in' },
          },
        },
      },
    }),
  ],
};
