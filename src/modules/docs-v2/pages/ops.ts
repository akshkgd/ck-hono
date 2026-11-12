import { ep, p, SAMPLE, section, type Page } from '../kit.js';

const openWarning = (what: string) =>
  `<div class="callout warn"><strong>${what} has no authentication.</strong> The router does not apply the session or admin middleware, so anyone who can reach the API can call these routes. Put them behind a network rule or add <code class="ic">authMiddleware(), adminMiddleware()</code>. Details in <a href="/docs/v2/reference/access-control">Access control</a>.</div>`;

const successEnvelope = `<p>These endpoints use <code class="ic">{ "success": true, ... }</code> rather than <code class="ic">{ "status": "success" }</code>.</p>`;

// ---------------------------------------------------------------- email

const to = p('to', 'email | email[]', 'required', 'One recipient or a list.');
const queuedExample = (category: string) => ({
  success: true,
  message: 'Email queued successfully',
  data: { queued: true, jobId: '1042', recipient: 'asha@example.com', category },
});

export const adminEmail: Page = {
  path: 'admin/email',
  title: 'Email',
  group: 'Operations',
  summary: 'Queue transactional emails, inspect delivery, and switch notification types on or off.',
  items: [
    section('intro', 'How email works', `
${openWarning('Everything on this page')}
${successEnvelope}
<ul>
  <li>Sending never blocks the request. Each call adds a job to the BullMQ <code class="ic">email-queue</code> and returns <strong>202</strong>. The <a href="/docs/v2/reference/architecture#workers">email worker</a> renders the template and sends it over SMTP (5 attempts, exponential backoff starting at 2 s, up to 15 jobs in parallel and 50 emails per second).</li>
  <li><code class="ic">queued: false</code> with <code class="ic">jobId: null</code> means the job was <strong>skipped</strong> because a notification toggle is off (see <a href="#settings">Email settings</a>).</li>
  <li>Without SMTP credentials the service runs in <strong>mock mode</strong>: nothing is sent, and <a href="#health">SMTP health</a> reports <code class="ic">mode: "Mock/Dev"</code>.</li>
  <li>Validation failures are the route-level Zod shape (<code class="ic">{ success: false, error: ... }</code>, status 400).</li>
</ul>
<p>Templates can be previewed in the <a href="/docs/email-preview">Email Sandbox</a>.</p>`),
    ep({
      id: 'health',
      method: 'GET',
      path: '/emails/health',
      access: 'open-admin',
      title: 'SMTP health',
      desc: 'Whether SMTP is configured and whether the connection verifies.',
      response: { status: 200, example: { success: true, data: { configured: true, verified: true, mode: 'SMTP' } } },
    }),
    ep({
      id: 'audit-logs',
      method: 'GET',
      path: '/emails/audit-logs',
      access: 'open-admin',
      title: 'Email job log',
      desc: 'Recent email jobs from the audit table.',
      query: [p('limit', 'integer', 'default 50', 'Rows to return.'), p('offset', 'integer', 'default 0', 'Rows to skip.')],
      response: { status: 200, example: { success: true, data: [{ id: SAMPLE.uuid, jobId: '1042', queueName: 'email-queue', jobName: 'send-email', status: 'completed', durationMs: 412, error: null, createdAt: SAMPLE.iso }] }, note: 'Rows are `job_audit_logs` records; only some columns are shown.' },
    }),
    ep({
      id: 'enrollment',
      method: 'POST',
      path: '/emails/enrollment',
      access: 'open-admin',
      title: 'Send enrollment email',
      desc: 'Welcome email after enrolling in a course. Honors the `enrollment` toggle.',
      body: [
        to,
        p('studentName', 'string', 'required', 'Greeting name.'),
        p('courseName', 'string', 'required', 'Course title.'),
        p('startDate', 'string', 'optional', 'Shown as given.'),
        p('whatsappLink', 'url', 'optional', 'Community link.'),
        p('telegramLink', 'url', 'optional', 'Community link.'),
        p('meetingLink', 'url', 'optional', 'Class link.'),
        p('callBookingLink', 'url', 'optional', 'Booking link.'),
        p('dashboardUrl', 'url', 'optional', 'Call-to-action target.'),
      ],
      bodyExample: { to: 'asha@example.com', studentName: 'Asha', courseName: 'Full-Stack Cohort', startDate: '1 Dec 2026', dashboardUrl: 'https://app.codekaro.in/dashboard' },
      response: { status: 202, example: queuedExample('ENROLLMENT') },
    }),
    ep({
      id: 'payment-success',
      method: 'POST',
      path: '/emails/payment-success',
      access: 'open-admin',
      title: 'Send payment receipt',
      desc: 'Receipt email. Honors the `payment` toggle.',
      body: [
        to,
        p('studentName', 'string', 'required', 'Greeting name.'),
        p('itemName', 'string', 'required', 'What was bought.'),
        p('amountPaid', 'number > 0', 'required', 'Amount.'),
        p('currency', 'string', "default 'INR'", ''),
        p('transactionId', 'string', 'optional', ''),
        p('invoiceId', 'string', 'optional', ''),
        p('paymentDate', 'string', 'optional', 'Shown as given.'),
        p('dashboardUrl', 'url', 'optional', ''),
      ],
      bodyExample: { to: 'asha@example.com', studentName: 'Asha', itemName: 'Full-Stack Cohort', amountPaid: 14999, transactionId: 'pay_Nk3x9d2LqP0aZ1' },
      response: { status: 202, example: queuedExample('PAYMENT_SUCCESS') },
    }),
    ep({
      id: 'access-granted',
      method: 'POST',
      path: '/emails/access-granted',
      access: 'open-admin',
      title: 'Send access-granted email',
      desc: 'Notifies a user that they gained access to something. Honors the `accessGranted` toggle.',
      body: [
        to,
        p('userName', 'string', 'required', 'Greeting name.'),
        p('resourceName', 'string', 'required', 'What they can now access.'),
        p('accessType', 'string', 'optional', 'For example `Batch Subscription Renewal`.'),
        p('accessTillDate', 'string', 'optional', ''),
        p('dashboardUrl', 'url', 'optional', ''),
      ],
      bodyExample: { to: 'asha@example.com', userName: 'Asha', resourceName: 'Full-Stack Cohort', accessTillDate: '12 Nov 2027' },
      response: { status: 202, example: queuedExample('ACCESS_GRANTED') },
    }),
    ep({
      id: 'generic',
      method: 'POST',
      path: '/emails/generic',
      access: 'open-admin',
      title: 'Send a generic email',
      desc: 'Title, message and an optional button. Only the master `enabled` toggle applies.',
      body: [
        to,
        p('title', 'string', 'required', 'Heading and default subject.'),
        p('message', 'string', 'required', 'Body text.'),
        p('actionText', 'string', 'optional', 'Button label.'),
        p('actionUrl', 'url', 'optional', 'Button target.'),
      ],
      bodyExample: { to: ['asha@example.com'], title: 'Class moved', message: 'Tomorrow\'s class starts at 7 pm.', actionText: 'Open dashboard', actionUrl: 'https://app.codekaro.in/dashboard' },
      response: { status: 202, example: queuedExample('GENERIC') },
    }),
    section('settings', 'Email settings', `
<p>Four toggles decide which categories are queued. Values live in the <code class="ic">system_settings</code> table (key <code class="ic">email_notification_toggles</code>); until a row exists they come from the <code class="ic">EMAIL_NOTIFICATIONS_ENABLED</code> and <code class="ic">EMAIL_NOTIFY_*</code> environment variables (anything other than <code class="ic">false</code> means on). Each API process caches the settings for 30 seconds, so a change can take that long to reach other processes in cluster mode.</p>
<div class="callout warn"><strong>The master switch also stops sign-in codes.</strong> The login OTP is sent as a <code class="ic">GENERIC</code> email, which is only gated by <code class="ic">enabled</code>. Turning it off stops OTP delivery, not just notifications.</div>
<div class="tablewrap"><table>
<thead><tr><th>Toggle</th><th>Gates</th></tr></thead>
<tbody>
<tr><td><code class="ic">enabled</code></td><td>Everything, including GENERIC emails such as OTPs and assignment feedback.</td></tr>
<tr><td><code class="ic">enrollment</code></td><td>ENROLLMENT emails.</td></tr>
<tr><td><code class="ic">payment</code></td><td>PAYMENT_SUCCESS emails.</td></tr>
<tr><td><code class="ic">accessGranted</code></td><td>ACCESS_GRANTED emails.</td></tr>
</tbody></table></div>`),
    ep({
      id: 'get-settings',
      method: 'GET',
      path: '/admin/email-settings',
      access: 'open-admin',
      title: 'Get email settings',
      desc: 'Current toggles.',
      response: { status: 200, example: { success: true, message: 'Email settings retrieved successfully', data: { enabled: true, enrollment: true, payment: true, accessGranted: true } } },
    }),
    ep({
      id: 'update-settings',
      method: 'PUT',
      path: '/admin/email-settings',
      access: 'open-admin',
      title: 'Update email settings',
      desc: 'Changes one or more toggles; omitted ones keep their value.',
      body: [
        p('enabled', 'boolean', 'optional', 'Master switch.'),
        p('enrollment', 'boolean', 'optional', ''),
        p('payment', 'boolean', 'optional', ''),
        p('accessGranted', 'boolean', 'optional', ''),
      ],
      bodyExample: { payment: false },
      response: { status: 200, example: { success: true, message: 'Email settings updated successfully', data: { enabled: true, enrollment: true, payment: false, accessGranted: true } } },
    }),
  ],
};

// ---------------------------------------------------------------- queues

export const adminQueues: Page = {
  path: 'admin/queues',
  title: 'Job queues',
  group: 'Operations',
  summary: 'Enqueue background jobs and read queue metrics and the job audit log.',
  items: [
    section('intro', 'About', `
${openWarning('The queue router')}
<p>Three BullMQ queues exist: <code class="ic">email-queue</code>, <code class="ic">crawler-queue</code> and <code class="ic">migration-queue</code>. See <a href="/docs/v2/reference/architecture#workers">Architecture</a> for retry and concurrency settings. Enqueue calls return <strong>202</strong>.</p>`),
    ep({
      id: 'enqueue-email',
      method: 'POST',
      path: '/admin/queues/email',
      access: 'open-admin',
      title: 'Enqueue an email job',
      desc: 'Low-level email enqueue. Prefer the typed [email endpoints](/docs/v2/admin/email).',
      body: [
        p('to', 'string | string[]', 'required', 'Recipient(s).'),
        p('subject', 'string', 'required', 'Subject line.'),
        p('category', "'ENROLLMENT' | 'PAYMENT_SUCCESS' | 'ACCESS_GRANTED' | 'GENERIC' | 'CUSTOM'", 'optional', 'Template category.'),
        p('payload', 'object', 'optional', 'Template data for the category.'),
        p('body', 'string', 'optional', 'Plain text body.'),
        p('html', 'string', 'optional', 'HTML body.'),
        p('cc', 'string | string[]', 'optional', ''),
        p('bcc', 'string | string[]', 'optional', ''),
      ],
      bodyExample: { to: 'asha@example.com', subject: 'Hello', body: 'Plain text message' },
      response: { status: 202, example: { status: 'success', data: { jobId: '1043', queue: 'email-queue', status: 'queued' } }, note: '`status` is `skipped` (and `jobId` null) when notifications are switched off for the category.' },
      errors: [[400, '`Fields "to" and "subject" are required.`']],
    }),
    ep({
      id: 'enqueue-crawler',
      method: 'POST',
      path: '/admin/queues/crawler',
      access: 'open-admin',
      title: 'Enqueue a crawler job',
      desc: 'Queues a scrape of a URL on the crawler worker (2 jobs at a time, 3 attempts with a fixed 10 s delay).',
      body: [
        p('url', 'string', 'required', 'Page to scrape.'),
        p('depth', 'integer', 'optional', 'Link depth.'),
        p('selectors', 'string[]', 'optional', 'CSS selectors to extract.'),
        p('maxPages', 'integer', 'optional', 'Page cap.'),
        p('metadata', 'object', 'optional', 'Passed through to the job.'),
      ],
      bodyExample: { url: 'https://example.com', depth: 1, selectors: ['h1', 'p'] },
      response: { status: 202, example: { status: 'success', data: { jobId: 'crawler-aHR0cHM6Ly9leGFtcGxlLmNvbQ-1780000000000', queue: 'crawler-queue', status: 'queued' } } },
      errors: [[400, '`Field "url" is required.`']],
    }),
    ep({
      id: 'enqueue-migration',
      method: 'POST',
      path: '/admin/queues/migration',
      access: 'open-admin',
      title: 'Enqueue a migration job',
      desc: 'Queues a named migration on the migration worker (one attempt, no automatic retries).',
      body: [
        p('migrationName', 'string', 'required', 'Which migration routine to run.'),
        p('batchSize', 'integer', 'optional', 'Chunk size.'),
        p('dryRun', 'boolean', 'optional', 'Validate without writing.'),
        p('metadata', 'object', 'optional', 'Routine-specific data.'),
      ],
      bodyExample: { migrationName: 'BULK_USER_MIGRATION', dryRun: true },
      response: { status: 202, example: { status: 'success', data: { jobId: '17', queue: 'migration-queue', status: 'queued' } } },
      errors: [[400, '`Field "migrationName" is required.`']],
    }),
    ep({
      id: 'metrics',
      method: 'GET',
      path: '/admin/queues/metrics',
      access: 'open-admin',
      title: 'Queue metrics',
      desc: 'Job counts per queue by state.',
      response: {
        status: 200,
        example: {
          status: 'success',
          data: {
            emailQueue: { waiting: 0, active: 1, completed: 8210, failed: 3, delayed: 2 },
            crawlerQueue: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
            migrationQueue: { waiting: 0, active: 0, completed: 12, failed: 0, delayed: 0 },
          },
        },
      },
    }),
    ep({
      id: 'logs',
      method: 'GET',
      path: '/admin/queues/logs',
      access: 'open-admin',
      title: 'Job audit log',
      desc: 'Most recent job audit rows, newest first.',
      query: [p('limit', 'integer', 'default 50', 'Rows to return.'), p('queueName', "'email-queue' | 'crawler-queue' | 'migration-queue'", 'optional', 'Only this queue.')],
      response: {
        status: 200,
        example: {
          status: 'success',
          data: [{ id: SAMPLE.uuid, jobId: '1042', queueName: 'email-queue', jobName: 'send-email', status: 'completed', payload: { to: 'asha@example.com' }, result: { delivered: true }, error: null, durationMs: 412, createdAt: SAMPLE.iso, updatedAt: SAMPLE.iso }],
        },
        note: '`status` is `pending`, `processing`, `completed` or `failed`.',
      },
    }),
  ],
};

// ---------------------------------------------------------------- migrations

export const adminMigrations: Page = {
  path: 'admin/migrations',
  title: 'Legacy data migration',
  group: 'Operations',
  summary: 'Bulk-import users, batches, enrollments and payments from the previous platform in chunks.',
  items: [
    section('intro', 'How it works', `
${openWarning('The migration router')}
<p>Mounted at <code class="ic">/v1/admin/migrations</code>, <code class="ic">/v1/migration</code> and <code class="ic">/migration</code>; all three reach the same handlers. The progress UI is at <code class="ic">/migration-status</code>.</p>
<ol>
  <li>Send each chunk of legacy records to the matching endpoint. The server logs an audit row, adds a <code class="ic">migration-queue</code> job, and returns immediately with a <code class="ic">jobId</code>.</li>
  <li>The migration worker inserts the records. <strong>If no worker process is running, the API runs the chunk inline in the background itself.</strong></li>
  <li>Poll <a href="#status">status</a> with the <code class="ic">jobId</code> until <code class="ic">state</code> is <code class="ic">completed</code> or <code class="ic">failed</code>.</li>
</ol>
<ul>
  <li>Records can be sent under <code class="ic">data</code> or under a key named for the entity (<code class="ic">users</code>, <code class="ic">batches</code>, <code class="ic">enrollments</code>, <code class="ic">payments</code>).</li>
  <li>Chunk size: <code class="ic">chunk_size</code> if sent, else <code class="ic">batchSize</code> (10–5000, default 2000). Send <code class="ic">dryRun: true</code> to validate without writing.</li>
  <li>Legacy field names are accepted in several spellings (for example <code class="ic">avatar</code>, <code class="ic">avatarUrl</code> and <code class="ic">avatar_url</code>), and ids may be numbers or strings. All record fields are optional at the schema level; the worker decides what a usable record is.</li>
  <li>The success envelope here includes <code class="ic">success: true</code> and <code class="ic">processed</code> (the number of records received).</li>
</ul>`),
    ...(
      [
        ['users', 'Migrate users', 'Legacy user records.', { id: 4211, name: 'Asha Verma', email: 'asha@example.com', mobile: '9876543210', role: 'student', is_verified: 1, xp: 120, created_at: '2023-04-02 10:20:00' }, 'Users'],
        ['batches', 'Migrate batches', 'Legacy batch / course records.', { id: 18, name: 'Full-Stack Cohort', slug: 'full-stack-cohort', price: 14999 }, 'Batches'],
        ['enrollments', 'Migrate enrollments', 'Legacy course enrollments.', { id: 9001, user_id: 4211, batch_id: 18 }, 'Enrollments'],
        ['payments', 'Migrate payments', 'Legacy payment rows. `enrollment_id`, `enrollmentId` and `course_enrollment_id` are all accepted.', { id: 77, enrollment_id: 9001, amount: 14999, transaction_id: 'pay_Nk3x9d2LqP0aZ1', paid_at: '2023-04-02 10:25:00' }, 'Payments'],
      ] as const
    ).map(([entity, title, desc, record, label]) =>
      ep({
        id: `migrate-${entity}`,
        method: 'POST',
        path: `/admin/migrations/${entity}`,
        access: 'open-admin',
        title,
        desc,
        body: [
          p('data', 'object[]', `one of data / ${entity}`, 'The records of this chunk.'),
          p(entity, 'object[]', `one of data / ${entity}`, 'Alias for `data`.'),
          p('batchSize', 'integer 10–5000', 'default 2000', 'Insert chunk size inside the job.'),
          p('chunk_size', 'integer', 'optional', 'Overrides `batchSize` when sent.'),
          p('batch_index', 'integer', 'optional', 'Your chunk number; only used in the response message.'),
          p('entity', 'string', 'optional', 'Label, not used for routing.'),
          p('dryRun', 'boolean', 'default false', 'Validate without writing.'),
        ],
        bodyExample: { batch_index: 1, batchSize: 2000, dryRun: false, data: [record] },
        response: {
          status: 200,
          example: {
            success: true,
            status: 'success',
            processed: 1,
            message: `${label} chunk 1 processed successfully.`,
            data: { jobId: `${({ users: 'user', batches: 'batch', enrollments: 'enroll', payments: 'pay' } as const)[entity]}_mig_1780000000000_412`, bullJobId: '18', totalRecords: 1, batchSize: 2000, dryRun: false, status: 'processing', statusUrl: '/v1/admin/migrations/status/…' },
          },
          note: 'The message says "processed" but the work continues in the background; check `statusUrl`.',
        },
      })
    ),
    ep({
      id: 'status',
      method: 'GET',
      path: '/admin/migrations/status/:jobId',
      access: 'open-admin',
      title: 'Migration job status',
      desc: 'Live progress of a job, current database counts and the last ten audit rows. With an unknown id (or `latest`) it falls back to an active job, otherwise a waiting, then the last completed, then the last failed one.',
      pathParams: [p('jobId', 'string', 'required', '`data.jobId` from a migrate call.')],
      response: {
        status: 200,
        example: {
          status: 'success',
          data: {
            jobId: 'user_mig_1780000000000_412',
            name: 'process-user-migration',
            state: 'active',
            dbStats: { totalUsersInDb: 5200, totalAdminsInDb: 4, totalStudentsInDb: 5100, totalBatchesInDb: 30, totalEnrollmentsInDb: 3100, totalPaymentsInDb: 4200 },
            queueCounts: { waiting: 0, active: 1, completed: 3, failed: 0 },
            recentLogs: [],
            progress: { processed: 1200, total: 2000, percentage: '60.0%', successCount: 1195, failedCount: 5 },
            failedReason: null,
            timestamp: SAMPLE.iso,
            finishedOn: null,
          },
        },
        note: 'With nothing to report: `state: "idle"`, `jobId: "none"`. `state` is one of `queued`, `active`, `completed`, `failed`.',
      },
    }),
    ep({
      id: 'clear-logs',
      method: 'POST',
      path: '/admin/migrations/clear-logs',
      access: 'open-admin',
      title: 'Clear migration audit logs',
      desc: 'Deletes every `job_audit_logs` row for `migration-queue`. No body.',
      response: { status: 200, example: { success: true, message: 'Migration audit logs cleared successfully.' } },
    }),
  ],
};

// ---------------------------------------------------------------- logs

export const adminLogs: Page = {
  path: 'admin/logs',
  title: 'Server logs',
  group: 'Operations',
  summary: 'Browse, download, clear and delete the daily application log files.',
  items: [
    section('intro', 'About', `
${openWarning('The log router')}
<p>Logs are JSON-lines files named <code class="ic">app-*.log</code> in the <code class="ic">logs/</code> directory next to the running process. File names are reduced to their basename, so path traversal is not possible. Responses set no-cache headers. The viewer page is <code class="ic">/admin/logs</code>, which is also unauthenticated.</p>
<p>Log files can contain request details, so exposing this router publicly can leak information as well as allow deletion.</p>`),
    ep({
      id: 'files',
      method: 'GET',
      path: '/admin/logs/files',
      access: 'open-admin',
      title: 'List log files',
      desc: 'Names of `app-*.log` files, newest first.',
      response: { status: 200, example: { status: 'success', data: ['app-2026-11-12.log', 'app-2026-11-11.log'] } },
    }),
    ep({
      id: 'data',
      method: 'GET',
      path: '/admin/logs/data',
      access: 'open-admin',
      title: 'Read a log file',
      desc: 'Parses the file, newest entries first, then filters and paginates in memory. Non-JSON lines are returned as `debug` entries.',
      query: [
        p('file', 'string', 'required', 'File name from the list.'),
        p('level', 'string', "default 'all'", 'Exact level, for example `error`, `warn`, `info`.'),
        p('q', 'string', 'optional', 'Case-insensitive match on message, level or metadata.'),
        p('limit', 'integer', 'default 100', 'Page size.'),
        p('page', 'integer', 'default 1', 'Page number.'),
      ],
      notes: ['The whole file is read into memory on every call, so very large files are slow.'],
      response: {
        status: 200,
        example: {
          status: 'success',
          data: {
            logs: [{ timestamp: SAMPLE.iso, level: 'error', message: 'Request ID: 3f1a... - connection reset', meta: { requestId: '3f1a...' } }],
            fileSizeKb: 412.7,
            pagination: { page: 1, limit: 100, totalCount: 1, totalPages: 1 },
          },
        },
      },
      errors: [[400, '`Log file parameter is required` or `Log file not found`.']],
    }),
    ep({
      id: 'download',
      method: 'GET',
      path: '/admin/logs/:file/download',
      access: 'open-admin',
      title: 'Download a log file',
      desc: 'Streams the raw file as an attachment.',
      pathParams: [p('file', 'string', 'required', 'File name.')],
      rawResponse: true,
      response: { status: 200, note: '`Content-Type: text/plain` with `Content-Disposition: attachment`.' },
      errors: [[404, '`Log file not found` (plain text).']],
    }),
    ep({
      id: 'clear',
      method: 'DELETE',
      path: '/admin/logs/:file/clear',
      access: 'open-admin',
      title: 'Empty a log file',
      desc: 'Truncates the file to zero bytes but keeps it.',
      pathParams: [p('file', 'string', 'required', 'File name.')],
      response: { status: 200, example: { status: 'success', message: 'Log file cleared successfully' } },
      errors: [[400, '`Log file not found`.']],
    }),
    ep({
      id: 'delete',
      method: 'DELETE',
      path: '/admin/logs/:file',
      access: 'open-admin',
      title: 'Delete a log file',
      desc: 'Removes the file from disk.',
      pathParams: [p('file', 'string', 'required', 'File name.')],
      response: { status: 200, example: { status: 'success', message: 'Log file deleted successfully' } },
      errors: [[400, '`Log file not found`.']],
    }),
  ],
};

// ---------------------------------------------------------------- terminal

export const adminTerminal: Page = {
  path: 'admin/terminal',
  title: 'Admin terminal',
  group: 'Operations',
  summary: 'Run a fixed set of diagnostic commands, or arbitrary shell commands when explicitly enabled.',
  items: [
    section('intro', 'How it works', `
<p>The page <code class="ic">/admin/terminal</code> is static HTML; the commands run through these two admin-only endpoints (signed-in admin session required).</p>
<ul>
  <li><strong>Allowlist mode</strong> always works. Ten fixed commands run directly (no shell), with a 30 s timeout.</li>
  <li><strong>Free-form mode</strong> runs <code class="ic">/bin/sh -c &lt;command&gt;</code> and is <strong>off unless the server has <code class="ic">ADMIN_SHELL_ENABLED=true</code></strong>. It is remote code execution for anyone with an admin session, so leave it off in production unless needed.</li>
  <li>One command runs at a time per process. A second request gets <code class="ic">409</code> until the first ends.</li>
  <li>Commands run in the server's working directory with a minimal environment (<code class="ic">PATH</code>, <code class="ic">HOME</code>, <code class="ic">LANG</code>, <code class="ic">NODE_ENV</code>, <code class="ic">TERM</code>): application secrets are not passed to the child.</li>
  <li>Output is capped at 200 KB (the process is killed and <code class="ic">truncated: true</code> is set). Timeouts kill the whole process group.</li>
  <li>Every run is written to the server log with the admin's id and email.</li>
</ul>`),
    ep({
      id: 'commands',
      method: 'GET',
      path: '/admin/terminal/commands',
      access: 'admin',
      title: 'List allowed commands',
      desc: 'The allowlist and whether free-form mode is on.',
      response: {
        status: 200,
        example: {
          status: 'success',
          data: {
            freeFormEnabled: false,
            commands: [
              { id: 'health', label: 'API health', description: 'GET /health on this server' },
              { id: 'node-version', label: 'Node version', description: 'node -v' },
              { id: 'uptime', label: 'Uptime & load', description: 'uptime' },
              { id: 'disk', label: 'Disk usage', description: 'df -h' },
              { id: 'memory', label: 'Memory (Linux)', description: 'free -m' },
              { id: 'pm2-status', label: 'PM2 status', description: 'pm2 status' },
              { id: 'pm2-logs', label: 'PM2 logs (last 100 lines)', description: 'pm2 logs --nostream' },
              { id: 'git-log', label: 'Last 10 commits', description: 'git log -n 10 --oneline' },
              { id: 'migrations', label: 'Migration files', description: 'ls src/db/migrations' },
              { id: 'redis-ping', label: 'Redis ping', description: 'redis-cli ping' },
            ],
          },
        },
      },
    }),
    ep({
      id: 'run',
      method: 'POST',
      path: '/admin/terminal/run',
      access: 'admin',
      title: 'Run a command',
      desc: 'Send **exactly one** of `commandId` or `command`.',
      body: [
        p('commandId', 'string', 'one of commandId / command', 'An `id` from the allowlist.'),
        p('command', 'string ≤ 2000', 'one of commandId / command', 'Free-form shell command. Needs `ADMIN_SHELL_ENABLED=true`.'),
        p('timeoutSeconds', 'integer 1–120', 'default 30', 'Free-form only; allowlist commands always use 30 s.'),
      ],
      bodyExample: { commandId: 'pm2-status' },
      response: {
        status: 200,
        example: {
          status: 'success',
          data: { command: 'pm2 status --no-color', mode: 'allowlist', exitCode: 0, signal: null, timedOut: false, truncated: false, durationMs: 312, stdout: '┌────┬───────────────┐ ...', stderr: '' },
        },
        note: 'A non-zero `exitCode` is still a 200: the command ran. Check `exitCode`, `timedOut` and `stderr`.',
      },
      errors: [
        [400, 'Both or neither of `commandId` / `command` sent, `Unknown command id`, `Command is empty`, `Command is too long`.'],
        [403, '`Free-form commands are disabled. Set ADMIN_SHELL_ENABLED=true on the server to enable them.`'],
        [409, '`Another command is still running. Wait for it to finish.`'],
      ],
    }),
  ],
};
