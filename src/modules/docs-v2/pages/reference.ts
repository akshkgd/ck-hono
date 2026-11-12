import { esc, section, type Page } from '../kit.js';

const code = (s: string) => `<code class="ic">${esc(s)}</code>`;

const table = (head: string[], rows: string[][]) =>
  `<div class="tablewrap"><table><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;

// ---------------------------------------------------------------- access control

export const accessControl: Page = {
  path: 'reference/access-control',
  title: 'Access control',
  group: 'Reference',
  summary: 'Who can call what, derived from how each router is wired. Includes the routes that are currently unprotected.',
  items: [
    section('middleware', 'Middleware', `
<ul>
  <li>${code('authMiddleware')} loads the Better Auth session, then re-reads <code class="ic">role</code> and <code class="ic">status</code> from the database. No session gives <code class="ic">401</code>. A deleted user gives <code class="ic">401</code>. It does <strong>not</strong> reject <code class="ic">inactive</code> or <code class="ic">suspended</code> users; changing a status instead deletes that user's sessions so they must sign in again.</li>
  <li>${code('adminMiddleware')} requires <code class="ic">role === "admin"</code>, otherwise <code class="ic">403</code>. Always used after <code class="ic">authMiddleware</code>.</li>
  <li>Razorpay <code class="ic">create-order</code> uses an inline optional-auth check: a valid session is used when present, otherwise the request is a guest checkout.</li>
</ul>`),
    section('matrix', 'Route groups', table(
      ['Route group', 'Access', 'Page'],
      [
        [code('/v1/auth/*'), 'Public (Better Auth) ; <code class="ic">/me</code> needs a session', '<a href="/docs/v2/auth">Authentication</a>'],
        [code('/v1/users/public'), code('/v1/batches/*/public') + ', ' + code('/v1/live-sessions/*') + ': <strong>public</strong>', '<a href="/docs/v2/public">Public APIs</a>'],
        [code('/health*'), code('/v1') + ': <strong>public</strong>', '<a href="/docs/v2/health">Health</a>'],
        [code('/v1/student/*'), code('/v1/course-progress/*') + ': <strong>signed-in user</strong>', '<a href="/docs/v2/student/courses">Student</a>'],
        [code('/v1/payments/razorpay/create-order'), 'Optional session (guest allowed)', '<a href="/docs/v2/payments/razorpay">Payments</a>'],
        [code('/v1/payments/razorpay/verify'), 'Public, signature-verified', '<a href="/docs/v2/payments/razorpay">Payments</a>'],
        [code('/v1/payments/razorpay/webhook'), 'Public, HMAC-verified', '<a href="/docs/v2/payments/razorpay">Payments</a>'],
        [code('/v1/admin/*') + ' (everything not listed below)', '<strong>Admin</strong>', '<a href="/docs/v2/admin/users">Admin</a>'],
        [code('/v1/admin/terminal/*'), '<strong>Admin</strong> (free-form shell additionally needs <code class="ic">ADMIN_SHELL_ENABLED</code>)', '<a href="/docs/v2/admin/terminal">Terminal</a>'],
      ]
    )),
    section('unprotected', 'Routes with no authentication', `
<div class="callout warn"><strong>These routes do not apply <code class="ic">authMiddleware</code> or <code class="ic">adminMiddleware</code>.</strong> Several have comments in the source saying they were left open deliberately for temporary migration work. They are reachable by anyone who can reach the API, and some of them delete files, write the database or send email.</div>
${table(
  ['Route', 'What anyone can do', 'Page'],
  [
    [code('/v1/admin/logs/*'), 'Read, download, clear and delete server log files. Logs may include request metadata.', '<a href="/docs/v2/admin/logs">Logs</a>'],
    [code('/v1/admin/queues/*'), 'Enqueue email, crawler and migration jobs; read queue metrics and the audit log.', '<a href="/docs/v2/admin/queues">Job queues</a>'],
    [code('/v1/admin/migrations/*') + ', ' + code('/v1/migration/*') + ', ' + code('/migration/*'), 'Insert bulk users, batches, enrollments and payments; read live DB counts; clear audit logs.', '<a href="/docs/v2/admin/migrations">Migration</a>'],
    [code('/v1/emails/*'), 'Queue arbitrary emails (to any address) using the platform\'s sender; read the email job log.', '<a href="/docs/v2/admin/email">Email</a>'],
    [code('/v1/admin/email-settings'), 'Read and change notification toggles, including the master switch that also stops login codes.', '<a href="/docs/v2/admin/email">Email</a>'],
    [code('/v1/auth/debug-session'), 'Echoes all request headers (including any credentials sent) and writes them to the log.', '<a href="/docs/v2/auth#debug-session">Authentication</a>'],
  ]
)}
<p>Server-rendered pages that are <em>pages only</em> (their API calls are protected): ${code('/admin/terminal')}, ${code('/admin/fix-enrollment-totals')}. The ${code('/admin/logs')} page is open too, and so are ${code('/migration-status')}, ${code('/docs')}, ${code('/playground')}, ${code('/changelog')} and ${code('/student-docs')}.</p>
<p>A typical fix is to add <code class="ic">router.use('*', authMiddleware(), adminMiddleware())</code> to those routers, as the other admin routers do.</p>`),
  ],
};

// ---------------------------------------------------------------- database

type Col = [string, string, string?];
const tableDoc = (name: string, intro: string, cols: Col[]) => `
<h3 class="!mt-8"><code class="ic">${esc(name)}</code></h3>
<p>${intro}</p>
<div class="tablewrap"><table><thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead><tbody>${cols
  .map((c) => `<tr><td><code class="ic">${esc(c[0])}</code></td><td class="font-mono text-xs">${esc(c[1])}</td><td>${c[2] ?? ''}</td></tr>`)
  .join('')}</tbody></table></div>`;

const ts: Col[] = [['created_at', 'timestamp', 'default now()'], ['updated_at', 'timestamp', 'default now()']];

export const database: Page = {
  path: 'reference/database',
  title: 'Database',
  group: 'Reference',
  summary: 'PostgreSQL tables and enums managed with Drizzle ORM. Source: src/db/schema.ts.',
  items: [
    section('overview', 'Overview', `
<ul>
  <li>All primary keys are UUIDs (<code class="ic">defaultRandom()</code>). Column names are snake_case in SQL and camelCase in the API.</li>
  <li>Migrations live in <code class="ic">src/db/migrations</code> (8 files). Commands: <code class="ic">pnpm db:generate</code>, <code class="ic">db:migrate</code>, <code class="ic">db:push</code>, <code class="ic">db:seed</code>, <code class="ic">db:seed:all</code>, <code class="ic">db:reset</code>, <code class="ic">db:rebuild</code>, <code class="ic">db:fresh</code>.</li>
  <li>The user search uses <code class="ic">pg_trgm</code> GIN indexes on name and email, so the extension must exist.</li>
  <li>Money columns are integer rupees.</li>
</ul>`),
    section('enums', 'Enums', table(
      ['Enum', 'Values'],
      [
        [code('role'), 'student, admin, user, moderator, teacher'],
        [code('status'), 'active, inactive, suspended'],
        [code('occupation_type'), 'student, professional, academic, other'],
        [code('batch_type'), 'cohort, live, webinar, callBooking, mentorship, recorded'],
        [code('batch_status'), 'active, private, completed'],
        [code('enrollment_type'), 'oneTime, Subscription, free'],
        [code('payment_status'), 'captured, failed, created, refunded'],
        [code('subscription_status'), 'active, expired, pending'],
        [code('content_library_type'), 'video, coding lab, assignment, article'],
        [code('content_type_class'), 'primary, secondary'],
        [code('user_status'), 'not_started, learning, completed (course progress state)'],
        [code('assignment_status'), 'pending, submitted, under review, approved, rejected'],
        [code('code_submitted_status'), 'Accepted, rejected, attempted'],
        [code('job_status'), 'pending, processing, completed, failed'],
        [code('bug_status'), 'pending, investigating, resolved, closed'],
        [code('bug_severity'), 'low, medium, high, critical'],
      ]
    )),
    section('people', 'People and sign-in',
      tableDoc('users', 'Learners, admins and staff. Better Auth uses this table as its user table.', [
        ['id', 'uuid pk'], ['email', 'varchar(255)', 'unique, not null'], ['password', 'varchar(255)', 'argon2 hash; only set for admin-created and guest-checkout users'],
        ['name', 'varchar(255)'], ['mobile', 'varchar(20)'], ['avatar_url / bio / linkedin_url / github_url', 'text'],
        ['occupation_type', 'enum', "default 'other'"], ['occupation_title', 'varchar(100)'], ['organization', 'varchar(150)'], ['experience_years', 'smallint'],
        ['role', 'enum', "default 'student'"], ['status', 'enum', "default 'active'"], ['google_id', 'varchar(255)'], ['email_verified', 'boolean', 'default false'],
        ['xp / current_streak / longest_streak', 'integer', 'default 0'], ['metadata', 'jsonb', 'default {}'], ['last_active_at', 'timestamp', 'default now()'], ...ts,
      ]) +
      tableDoc('session', 'Better Auth sessions. Also holds the location the API adds.', [
        ['id', 'uuid pk'], ['user_id', 'uuid', 'fk users, cascade'], ['token', 'text', 'unique'], ['expires_at', 'timestamp'],
        ['ip_address / user_agent', 'text'], ['country / city', 'text', 'from Cloudflare headers'], ...ts,
      ]) +
      tableDoc('account', 'Better Auth provider accounts (credentials, social).', [
        ['id', 'uuid pk'], ['user_id', 'uuid', 'fk users, cascade'], ['account_id / provider_id', 'text'], ['access_token / refresh_token / id_token / scope', 'text'],
        ['access_token_expires_at / refresh_token_expires_at', 'timestamp'], ['password', 'text'], ...ts,
      ]) +
      tableDoc('verification', 'Better Auth one-time codes and tokens (the email OTP lives here).', [
        ['id', 'uuid pk'], ['identifier', 'text'], ['value', 'text'], ['expires_at', 'timestamp'], ...ts,
      ])
    ),
    section('courses', 'Courses and content',
      tableDoc('batches', 'A course, cohort, webinar or other sellable offering.', [
        ['id', 'uuid pk'], ['name', 'varchar(255)', 'not null'], ['topic / description / desc / slug', 'varchar(255)', 'slug indexed'], ['price / renewal_fee / certificate_fee', 'integer', 'rupees; certificate_fee default 0'],
        ['limit', 'integer', 'default 0'], ['img / association / logo', 'varchar(255)'], ['type', 'enum', "default 'cohort'"], ['status', 'enum', "default 'private'"],
        ['start_date / end_date', 'date', 'not null'], ['whatsapp_link / telegram_link / telegram_broadcast / meeting_link', 'varchar(255)'],
        ['teacher_id', 'uuid', 'fk users, set null'], ['teacher_payment', 'boolean', 'default false'], ['next_class_topic', 'varchar(255)'], ['next_class', 'timestamp'],
        ['access_till_date', 'date'], ['access_till_year', 'integer', 'default 1'], ['metadata', 'jsonb', 'default {}'], ...ts,
      ]) +
      tableDoc('batch_sections', 'Ordered groups inside a batch.', [['id', 'uuid pk'], ['title', 'varchar'], ['batch_id', 'uuid', 'fk batches, cascade'], ['order', 'integer'], ...ts]) +
      tableDoc('content_library', 'Reusable lessons.', [
        ['id', 'uuid pk'], ['title', 'varchar'], ['desc', 'text'], ['type', 'enum'], ['content_type', 'enum', "default 'primary'"], ['video_link', 'varchar'],
        ['video_duration', 'integer', 'seconds, but some legacy rows are minutes (see Architecture)'], ['assignment', 'text'], ['xp', 'integer'], ['solution_code', 'text'], ['hints', 'jsonb'], ['metadata', 'jsonb'], ...ts,
      ]) +
      tableDoc('batch_content', 'A library item placed in a batch section, with unlock rules.', [
        ['id', 'uuid pk'], ['batch_id', 'uuid', 'fk batches'], ['content_id', 'uuid', 'fk content_library'], ['section_id', 'uuid', 'fk batch_sections'], ['order', 'integer'],
        ['access_on / access_till', 'integer', 'relative days; 0 = no rule'], ['access_on_date / access_till_date', 'date'], ['can_submit_assignment', 'boolean'], ['metadata', 'jsonb'], ...ts,
      ]) +
      tableDoc('batch_live_sessions', 'Scheduled live classes.', [
        ['id', 'uuid pk'], ['batch_id', 'uuid', 'fk batches, cascade'], ['section_id', 'uuid', 'fk batch_sections, cascade'], ['topic', 'varchar(255)'], ['desc', 'text'], ['time', 'timestamp'],
        ['screen_hls_video / face_hls_video / recording_hls', 'varchar(255)'], ['order', 'integer', 'default 0'], ['dummy_count', 'integer'], ...ts,
      ])
    ),
    section('commerce', 'Enrollments and payments',
      tableDoc('batch_enrollments', 'A learner\'s access to a batch.', [
        ['id', 'uuid pk'], ['user_id', 'uuid', 'fk users, cascade'], ['batch_id', 'uuid', 'fk batches, cascade'], ['amount_payable / amount_paid', 'integer', 'rupees; amount_paid is recalculated from payments'],
        ['enrollment_type', 'enum', "default 'oneTime'"], ['status', 'smallint', 'default 0 (inactive); 1 active'], ['progress', 'integer', '0–100, derived from course_progress'], ['time_spent_seconds', 'integer', 'derived'],
        ['payment_status', 'enum', "default 'created'; must be captured for access"], ['payment_method / coupon_code / transaction_id / invoice_id', 'varchar'], ['certificate_fee / certificate_id / certificate_generated_at', ''],
        ['subscription_id / subscription_status / subscription_active_on / subscription_expires_on', ''], ['paid_at / started_at', 'timestamp'], ['access_till', 'date'], ['override_access_days', 'integer'],
        ['utm_source / utm_medium / utm_campaign', 'varchar'], ['remark', 'text'], ['sequential_learning / sequential_learning_with_assignments', 'boolean'], ['metadata', 'jsonb'], ...ts,
      ]) +
      tableDoc('batch_enrollment_payments', 'Individual payments on an enrollment.', [
        ['id', 'uuid pk'], ['batch_enrollment_id', 'uuid', 'fk batch_enrollments'], ['amount', 'integer'], ['paid_at', 'timestamp'], ['payment_method', 'varchar'], ['transaction_id / invoice_id', 'varchar', 'unique across payments (enforced in code)'],
        ['purpose', 'varchar', 'enrollment, renewal, certificate, upgrade, refund'], ['is_gst_applicable', 'boolean'], ['remarks', 'text'], ['metadata', 'jsonb'], ...ts,
      ])
    ),
    section('learning', 'Learning activity',
      tableDoc('course_progress', 'One row per learner per content item (or live session). Unique on (enrollment_id, batch_content_id).', [
        ['id', 'uuid pk'], ['user_id', 'uuid', 'fk users'], ['enrollment_id', 'uuid', 'fk batch_enrollments'], ['batch_content_id', 'uuid', 'null for live-session rows'], ['batch_live_session_id', 'uuid'],
        ['time_spent', 'integer', 'seconds'], ['live_session_time_spent', 'integer', 'seconds'], ['progress', 'integer', '0–100'], ['status', 'enum', 'not_started / learning / completed'],
        ['github_link / deployed_link', 'varchar'], ['assignment_status', 'enum'], ['user_remark / teacher_remark / video_feedback / code_submitted', 'text'], ['code_submitted_status', 'enum'],
        ['last_watched_position', 'integer', 'seconds'], ['last_ping_at', 'timestamp', 'server time of the last heartbeat'], ...ts,
      ]) +
      tableDoc('learner_watchlist', 'Learners flagged for follow-up. Unique on (user_id, batch_id).', [
        ['id', 'uuid pk'], ['user_id / enrollment_id / batch_id', 'uuid', 'fks, cascade'], ['reason', 'text'], ['last_followup', 'timestamp'], ['added_by', 'uuid', 'fk users, set null'], ...ts,
      ]) +
      tableDoc('reported_bugs', 'Learner bug reports.', [
        ['id', 'uuid pk'], ['user_id', 'uuid', 'fk users, cascade'], ['description', 'text'], ['url', 'varchar(1024)'], ['severity', 'enum', "default 'medium'"], ['status', 'enum', "default 'pending'"],
        ['device_info', 'jsonb'], ['screenshot_url', 'varchar(255)'], ['remarks', 'text'], ...ts,
      ])
    ),
    section('system', 'System',
      tableDoc('job_audit_logs', 'One row per background job: start, result and failure.', [
        ['id', 'uuid pk'], ['job_id', 'varchar'], ['queue_name', 'varchar'], ['job_name', 'varchar'], ['status', 'enum'], ['payload / result', 'jsonb'], ['error', 'text'], ['duration_ms', 'integer'], ...ts,
      ]) +
      tableDoc('system_settings', 'Key/value runtime settings (currently the email toggles).', [
        ['key', 'varchar(100) pk', 'email_notification_toggles'], ['value', 'jsonb'], ['description', 'text'], ['updated_at', 'timestamp'],
      ])
    ),
  ],
};

// ---------------------------------------------------------------- environment

export const environment: Page = {
  path: 'reference/environment',
  title: 'Environment variables',
  group: 'Reference',
  summary: 'Every environment variable the code reads, what it does, and its default.',
  items: [
    section('how', 'Loading', `<p>Variables are loaded from <code class="ic">.env</code> by <code class="ic">dotenv</code> when the API starts. PM2 sets <code class="ic">NODE_ENV=production</code> and <code class="ic">PORT=3000</code> for the API. The worker process reads the same variables (it needs the database, Redis, SMTP and notification settings).</p>`),
    section('core', 'Core', table(
      ['Variable', 'Default', 'Used for'],
      [
        [code('PORT'), '3000', 'HTTP port.'],
        [code('NODE_ENV'), '—', '<code class="ic">production</code> sets the Secure flag on the payment-login cookie and chooses the default frontend URL.'],
        [code('FRONTEND_URL'), 'https://app.codekaro.in in production, http://localhost:5173 otherwise', 'Better Auth base URL and trusted origin, links in emails and grading notifications.'],
        [code('TIMEZONE'), 'Asia/Kolkata', 'Time zone for the "today", "this week", "this month" report windows.'],
        [code('ADMIN_SHELL_ENABLED'), 'unset (off)', 'Set to <code class="ic">true</code> to allow free-form commands in the admin terminal.'],
      ]
    )),
    section('auth', 'Authentication', table(
      ['Variable', 'Default', 'Used for'],
      [
        [code('BETTER_AUTH_SECRET'), 'falls back to <code class="ic">JWT_SECRET</code>, then a hard-coded development string', '<strong>Set this in production.</strong> Signs sessions and cookies. The built-in fallback is public in the source.'],
        [code('JWT_SECRET'), '—', 'Fallback for <code class="ic">BETTER_AUTH_SECRET</code>. No JWTs are issued by the API.'],
        [code('BETTER_AUTH_URL'), 'the frontend URL', 'Better Auth <code class="ic">baseURL</code>.'],
      ]
    )),
    section('data', 'Database and cache', table(
      ['Variable', 'Default', 'Used for'],
      [
        [code('DATABASE_URL'), '—', 'PostgreSQL connection string. Required.'],
        [code('DB_SSL'), 'on', '<code class="ic">false</code> disables TLS. TLS is also off for <code class="ic">localhost</code> / <code class="ic">127.0.0.1</code> hosts and for <code class="ic">sslmode=disable</code>.'],
        [code('DB_REJECT_UNAUTHORIZED'), 'false', '<code class="ic">true</code> validates the server certificate using <code class="ic">DB_CA_CERT</code> or the file at <code class="ic">DB_CERT_PATH</code>. When false, TLS is used without certificate checks.'],
        [code('DB_CA_CERT'), '—', 'CA certificate contents (PEM).'],
        [code('DB_CERT_PATH'), './ca-certificate.crt', 'CA certificate file path.'],
        [code('REDIS_URL'), 'redis://localhost:6379', 'Redis for the activity lock and the BullMQ connection. If it parses, host, port, username and password come from it.'],
        [code('REDIS_HOST'), '127.0.0.1', 'BullMQ host when <code class="ic">REDIS_URL</code> is not set.'],
        [code('REDIS_PORT'), '6379', 'BullMQ port when <code class="ic">REDIS_URL</code> is not set.'],
        [code('REDIS_PASSWORD'), '—', 'BullMQ password when <code class="ic">REDIS_URL</code> is not set.'],
      ]
    )),
    section('payments', 'Payments and video', table(
      ['Variable', 'Default', 'Used for'],
      [
        [code('RAZORPAY_KEY_ID'), '—', 'Public key returned to Checkout. Surrounding quotes are stripped.'],
        [code('RAZORPAY_KEY_SECRET'), '—', 'API auth and signature verification.'],
        [code('RAZORPAY_WEBHOOK_SECRET'), '—', 'Webhook signature verification.'],
        [code('BUNNY_CDN_TOKEN_KEY'), '—', 'Security key for signed playback URLs. Without it, raw video links are returned.'],
        [code('BUNNY_CDN_LIMIT_KBPS'), '0 (no limit)', 'Per-viewer download rate limit baked into signed URLs.'],
      ]
    )),
    section('email', 'Email', table(
      ['Variable', 'Default', 'Used for'],
      [
        [code('SMTP_HOST'), '—', 'SMTP server. Without host, user and password the service is in mock mode and sends nothing.'],
        [code('SMTP_PORT'), '587', 'SMTP port.'],
        [code('SMTP_USER'), '—', 'SMTP username.'],
        [code('SMTP_PASS'), '—', 'SMTP password.'],
        [code('SMTP_SECURE'), 'false', '<code class="ic">true</code> forces TLS. TLS is also used for port 465 or <code class="ic">MAIL_ENCRYPTION=ssl</code>.'],
        [code('MAIL_ENCRYPTION'), '—', '<code class="ic">ssl</code> forces TLS.'],
        [code('EMAIL_FROM'), '"Coding Kampus" &lt;noreply@codingkampus.com&gt;', 'Sender address.'],
        [code('EMAIL_NOTIFICATIONS_ENABLED'), 'on', 'Initial master switch; anything other than <code class="ic">false</code> is on. Overridden once the settings row exists.'],
        [code('EMAIL_NOTIFY_ENROLLMENT'), 'on', 'Initial value of the enrollment toggle.'],
        [code('EMAIL_NOTIFY_PAYMENT'), 'on', 'Initial value of the payment toggle.'],
        [code('EMAIL_NOTIFY_ACCESS_GRANTED'), 'on', 'Initial value of the access-granted toggle.'],
      ]
    )),
  ],
};

// ---------------------------------------------------------------- architecture

export const architecture: Page = {
  path: 'reference/architecture',
  title: 'Architecture',
  group: 'Reference',
  summary: 'How a request flows, what runs in the background, and the rules behind progress and streaks.',
  items: [
    section('request', 'Request pipeline', `
<ol>
  <li><strong>Request id</strong> (<code class="ic">X-Request-Id</code>), then the request logger.</li>
  <li><strong>CORS</strong> (allowlist, credentials, 24 h preflight cache), <strong>secure headers</strong>, <strong>gzip</strong>.</li>
  <li>The router: <code class="ic">/v1</code> and <code class="ic">/api</code> share one sub-router with the <strong>activity middleware</strong>, then each module's own auth middleware.</li>
  <li>Unhandled errors go to the global handler (500 with <code class="ic">requestId</code>); unknown routes return 404 <code class="ic">Route not found</code>.</li>
</ol>
<p>Each module follows <em>route → controller → service → repository</em> with Zod schemas in <code class="ic">*.validation.ts</code>. Run it with <code class="ic">pnpm dev</code> (watch mode), the workers with <code class="ic">pnpm worker</code>, tests with <code class="ic">pnpm test</code>.</p>`),
    section('deployment', 'Deployment', `
<ul>
  <li>PM2 (<code class="ic">ecosystem.config.cjs</code>) runs <strong>codekaro-api</strong> from <code class="ic">dist/index.js</code> in cluster mode with the maximum number of instances, and <strong>codekaro-workers</strong> from <code class="ic">dist/workers/index.js</code> as a single process.</li>
  <li>Build with <code class="ic">pnpm build</code> (TypeScript to <code class="ic">dist/</code>).</li>
  <li>In-memory state is per API process: the Better Auth rate limiter and the 30 s email-settings cache.</li>
  <li>Logs are written to <code class="ic">logs/app-YYYY-MM-DD.log</code> as JSON lines; files older than 14 days are cleaned up automatically.</li>
</ul>`),
    section('workers', 'Queues and workers', `
<p>BullMQ on Redis. The worker process starts all three workers and shuts them down cleanly on <code class="ic">SIGINT</code> / <code class="ic">SIGTERM</code>. Every job writes start, success and failure rows to <code class="ic">job_audit_logs</code>.</p>
${table(
  ['Queue', 'Attempts / backoff', 'Concurrency', 'Does'],
  [
    [code('email-queue'), '5, exponential from 2 s', '15 (max 50 jobs per second)', 'Renders a template by category and sends it over SMTP (mock mode without credentials).'],
    [code('crawler-queue'), '3, fixed 10 s', '2 (60 s lock)', 'Scrapes a URL.'],
    [code('migration-queue'), '1 (never retried automatically)', '5 (60 s lock)', 'Inserts legacy users, batches, enrollments and payments in chunks.'],
  ]
)}
<p>If no worker is attached to the migration queue, the API processes the chunk inline instead, so migrations do not stall without a worker. Email has no such fallback: without the worker process, queued emails (including login codes) wait in Redis.</p>`),
    section('progress', 'Progress and watch-time rules', `
<p>Implemented in <code class="ic">src/modules/student/video-progress.util.ts</code> and used by the student heartbeat endpoint.</p>
${table(
  ['Rule', 'Value'],
  [
    ['Maximum credit for one heartbeat', '180 seconds'],
    ['Wall-clock tolerance', '5 seconds'],
    ['Slowest playback rate assumed', '0.25×'],
    ['Completion threshold', '75 % (reported progress, progress from watch time, or watch time ≥ 75 % of video length)'],
    ['Video length unit', 'Values under 100 are minutes (×60), otherwise seconds'],
    ['Assignment status on completion', '<code class="ic">pending</code> when submissions are enabled'],
  ]
)}
<p>Credit per ping = the smallest of the client\'s legacy <code class="ic">timeSpent</code> (if any), the seconds since the previous ping, the distance the playback position moved (a paused video earns about zero), and the cap. Rewinds count as re-watching and are bounded only by the wall clock. Status and progress never go backwards.</p>
<p>All heartbeats of one enrollment are serialized with a row lock, so concurrent tabs cannot double-count. Enrollment totals are re-derived from the per-item rows: <code class="ic">timeSpentSeconds</code> is the sum of <code class="ic">time_spent</code>; <code class="ic">progress</code> is the sum of item progress divided by the number of items in the batch, capped at 100, counting only rows tied to batch content (not live sessions).</p>`),
    section('streaks', 'Activity and streaks', `
<p>After any authenticated <code class="ic">/v1</code> request, the API updates <code class="ic">last_active_at</code>, <code class="ic">current_streak</code> and <code class="ic">longest_streak</code>. A Redis key <code class="ic">user:&lt;id&gt;:active_lock</code> with a 15-minute TTL limits this to once per 15 minutes per user; without Redis it runs on every request.</p>
<ul>
  <li>First activity (streak 0) sets the streak to 1.</li>
  <li>A new calendar day (compared in UTC) after exactly one day continues the streak; a longer gap resets it to 1.</li>
  <li><code class="ic">longest_streak</code> is the maximum ever reached.</li>
</ul>`),
    section('video', 'Video delivery', `
<p>Videos are served from a Bunny CDN pull zone. Playback URLs are signed with HMAC-SHA256 token authentication and expire after <strong>3 hours</strong>. Only links on the configured pull-zone host are signed; other links are returned unchanged. Signed URLs are returned by <a href="/docs/v2/student/courses#content-access">content access</a> and the admin content-library search.</p>`),
    section('enrollment-lifecycle', 'Enrollment lifecycle', `
<ol>
  <li>An enrollment starts with <code class="ic">paymentStatus: "created"</code>, <code class="ic">status: 0</code> (checkout or an admin).</li>
  <li>Payments are rows in <code class="ic">batch_enrollment_payments</code>. <code class="ic">amount_paid</code> is recalculated from them (refund-purpose rows are subtracted). Paid ≥ payable gives <code class="ic">captured</code>; a partial payment keeps it at <code class="ic">created</code>; a fully refunded one becomes <code class="ic">refunded</code>.</li>
  <li>The Razorpay flow then sets <code class="ic">status: 1</code> and stamps <code class="ic">started_at</code>.</li>
  <li>Access runs until <code class="ic">access_till</code>, or one year from the start date when it is not set. A renewal payment extends it by one year from the later of the current expiry and today.</li>
</ol>`),
  ],
};
