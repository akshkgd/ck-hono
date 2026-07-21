export function getMigrationProgressHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Migration Dashboard - Codekaro Admin</title>
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
  </style>
</head>
<body class="bg-zinc-950 text-zinc-200 antialiased min-h-screen flex flex-col font-normal custom-scrollbar">

  <!-- Header -->
  <header class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-semibold tracking-wide text-sm font-mono">Migration & DB Inspector</span>
      </div>
      <div class="flex items-center space-x-3">
        <button onclick="clearLogs()" class="px-3 py-1.5 rounded bg-zinc-800 hover:bg-rose-900/40 text-rose-400 border border-rose-500/20 text-xs font-mono transition">Purge Audit Logs</button>
        <button onclick="fetchStatus()" class="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono transition">Refresh Now</button>
        <span id="auto-refresh-indicator" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Live (2s)
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-6 py-10 flex-1 w-full space-y-8">

    <!-- Top PostgreSQL DB Real-time Metrics -->
    <section class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
        <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Total DB Users</div>
        <div id="db-total-users" class="text-3xl font-extrabold text-white font-mono">0</div>
        <div class="text-[11px] font-mono text-emerald-400">PostgreSQL Live Count</div>
      </div>
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
        <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Students Migrated</div>
        <div id="db-students" class="text-3xl font-extrabold text-indigo-400 font-mono">0</div>
        <div class="text-[11px] font-mono text-zinc-400">role = "student"</div>
      </div>
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
        <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Admins Migrated</div>
        <div id="db-admins" class="text-3xl font-extrabold text-purple-400 font-mono">0</div>
        <div class="text-[11px] font-mono text-zinc-400">role = "admin" (role: 100)</div>
      </div>
      <div class="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-1">
        <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Redis Queue Chunks</div>
        <div id="queue-active-waiting" class="text-3xl font-extrabold text-amber-400 font-mono">0</div>
        <div id="queue-completed" class="text-[11px] font-mono text-zinc-400">0 completed</div>
      </div>
    </section>

    <!-- Main Live Stats Card -->
    <section class="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-6">
      <div class="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Job ID / Status</div>
          <div id="job-state" class="text-2xl font-bold text-white font-mono mt-1">Detecting...</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Chunk Progress</div>
          <div id="progress-percent" class="text-3xl font-extrabold text-emerald-400 font-mono mt-1">0.0%</div>
        </div>
      </div>

      <!-- Animated Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs font-mono text-zinc-400">
          <span>Current Batch Items</span>
          <span id="processed-ratio">0 / 0</span>
        </div>
        <div class="w-full bg-zinc-950 rounded-full h-4 p-0.5 border border-zinc-800 overflow-hidden">
          <div id="progress-bar" class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>

      <!-- Grid Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Inserted (Current Batch)</div>
          <div id="success-count" class="text-xl font-bold font-mono text-emerald-400">0</div>
        </div>
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Skipped / Invalid Emails</div>
          <div id="failed-count" class="text-xl font-bold font-mono text-rose-400">0</div>
        </div>
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Batch Duration</div>
          <div id="duration" class="text-xl font-bold font-mono text-indigo-400">0s</div>
        </div>
      </div>
    </section>

    <!-- Recent Job Audit Logs Table -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-mono text-zinc-400 uppercase font-semibold">Recent Migration Audit Logs</h3>
        <span class="text-xs font-mono text-zinc-600">Table: job_audit_logs</span>
      </div>
      <div class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr class="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400">
                <th class="py-3 px-4 font-medium">Job ID</th>
                <th class="py-3 px-4 font-medium">Status</th>
                <th class="py-3 px-4 font-medium">Duration</th>
                <th class="py-3 px-4 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody id="logs-tbody" class="divide-y divide-zinc-900 text-zinc-300">
              <tr>
                <td colspan="4" class="py-6 text-center text-zinc-600">Loading recent audit logs...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <script>
    async function fetchStatus() {
      try {
        const res = await fetch('/v1/admin/migrations/status/latest');
        const json = await res.json();
        
        if (json.data) {
          const d = json.data;

          // 1. Update PostgreSQL DB Stats
          if (d.dbStats) {
            document.getElementById('db-total-users').textContent = Number(d.dbStats.totalUsersInDb || 0).toLocaleString();
            document.getElementById('db-students').textContent = Number(d.dbStats.totalStudentsInDb || 0).toLocaleString();
            document.getElementById('db-admins').textContent = Number(d.dbStats.totalAdminsInDb || 0).toLocaleString();
          }

          // 2. Update Queue Counts
          if (d.queueCounts) {
            const activeWaiting = (d.queueCounts.waiting || 0) + (d.queueCounts.active || 0);
            document.getElementById('queue-active-waiting').textContent = activeWaiting.toLocaleString() + ' pending';
            document.getElementById('queue-completed').textContent = (d.queueCounts.completed || 0).toLocaleString() + ' completed chunks';
          }

          // 3. Update Current Job Progress
          document.getElementById('job-state').textContent = (d.jobId !== 'none' ? (d.jobId + ' (' + (d.state || 'active').toUpperCase() + ')') : 'IDLE');
          document.getElementById('progress-percent').textContent = d.progress?.percentage || '0%';
          document.getElementById('processed-ratio').textContent = (d.progress?.processed || 0).toLocaleString() + ' / ' + (d.progress?.total || 0).toLocaleString();
          
          const pct = parseFloat(d.progress?.percentage || '0');
          document.getElementById('progress-bar').style.width = Math.min(pct, 100) + '%';
          
          document.getElementById('success-count').textContent = (d.progress?.successCount || d.progress?.processed || 0).toLocaleString();
          document.getElementById('failed-count').textContent = (d.progress?.failedCount || 0).toLocaleString();

          if (d.timestamp) {
            const start = new Date(d.timestamp).getTime();
            const end = d.finishedOn ? new Date(d.finishedOn).getTime() : Date.now();
            const durationSec = Math.max(0, Math.round((end - start) / 1000));
            document.getElementById('duration').textContent = durationSec + 's';
          }

          // 4. Update Audit Logs Table
          if (d.recentLogs && d.recentLogs.length > 0) {
            const rowsHtml = d.recentLogs.map(log => {
              const statusColor = log.status === 'completed' ? 'text-emerald-400' : (log.status === 'failed' ? 'text-rose-400' : 'text-amber-400');
              const dateStr = log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'N/A';
              return '<tr class="hover:bg-zinc-900/40 transition">' +
                '<td class="py-2.5 px-4 font-mono text-indigo-300">' + (log.jobId || log.id) + '</td>' +
                '<td class="py-2.5 px-4 font-semibold uppercase ' + statusColor + '">' + log.status + '</td>' +
                '<td class="py-2.5 px-4 font-mono text-zinc-400">' + (log.durationMs ? log.durationMs + 'ms' : 'In Progress') + '</td>' +
                '<td class="py-2.5 px-4 text-zinc-500">' + dateStr + '</td>' +
              '</tr>';
            }).join('');
            document.getElementById('logs-tbody').innerHTML = rowsHtml;
          } else {
            document.getElementById('logs-tbody').innerHTML = '<tr><td colspan="4" class="py-4 text-center text-zinc-600">No audit logs recorded yet.</td></tr>';
          }
        }
      } catch (err) {
        console.error('Error fetching migration status:', err);
      }
    }

    async function clearLogs() {
      if (!confirm('Are you sure you want to purge old migration audit logs to free disk space?')) return;
      try {
        const res = await fetch('/v1/admin/migrations/clear-logs', { method: 'POST' });
        const data = await res.json();
        alert(data.message || 'Audit logs cleared.');
        fetchStatus();
      } catch (err) {
        alert('Failed to clear logs: ' + err.message);
      }
    }

    // Auto-poll every 2 seconds
    setInterval(fetchStatus, 2000);

    // Initial load
    fetchStatus();
  </script>
</body>
</html>`;
}
