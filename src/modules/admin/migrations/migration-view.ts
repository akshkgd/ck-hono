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
        <span class="text-zinc-50 font-semibold tracking-wide text-sm font-mono">10 Lakh User Migration Monitor</span>
      </div>
      <div class="flex items-center space-x-3">
        <span id="auto-refresh-indicator" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Live (Polling 2s)
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-10 flex-1 w-full space-y-8">

    <!-- Search / Input Job ID Bar -->
    <section class="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3 justify-between">
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <span class="text-xs font-mono text-zinc-400">Job ID:</span>
        <input type="text" id="job-id-input" placeholder="Auto-detecting active job..." class="bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono px-3 py-2 rounded-lg w-full sm:w-80 focus:outline-none focus:border-indigo-500">
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button onclick="fetchStatus()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono px-4 py-2 rounded-lg transition font-medium">Refresh Status</button>
        <button onclick="clearAndFetchLatest()" class="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono px-3 py-2 rounded-lg transition">Detect Active Job</button>
      </div>
    </section>

    <!-- Main Live Stats Card -->
    <section class="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-6">
      
      <div class="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Migration Job State</div>
          <div id="job-state" class="text-2xl font-bold text-white font-mono mt-1">Detecting...</div>
        </div>
        <div class="text-right">
          <div class="text-xs font-mono text-zinc-500 uppercase tracking-wider">Progress Percentage</div>
          <div id="progress-percent" class="text-3xl font-extrabold text-emerald-400 font-mono mt-1">0.0%</div>
        </div>
      </div>

      <!-- Animated Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs font-mono text-zinc-400">
          <span>Processed Records</span>
          <span id="processed-ratio">0 / 0</span>
        </div>
        <div class="w-full bg-zinc-950 rounded-full h-4 p-0.5 border border-zinc-800 overflow-hidden">
          <div id="progress-bar" class="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>

      <!-- Grid Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Successfully Inserted</div>
          <div id="success-count" class="text-xl font-bold font-mono text-emerald-400">0</div>
        </div>
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Failed / Duplicate Rows</div>
          <div id="failed-count" class="text-xl font-bold font-mono text-rose-400">0</div>
        </div>
        <div class="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-1">
          <div class="text-xs font-mono text-zinc-500">Execution Duration</div>
          <div id="duration" class="text-xl font-bold font-mono text-indigo-400">0s</div>
        </div>
      </div>

    </section>

    <!-- Raw Live JSON Response Box -->
    <section class="space-y-3">
      <div class="flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>Raw Real-time Job Metrics Response</span>
        <span class="text-zinc-600">GET /v1/admin/migrations/status/latest</span>
      </div>
      <pre id="raw-json" class="bg-zinc-950 p-5 rounded-xl border border-zinc-800 text-xs font-mono text-indigo-300 overflow-x-auto max-h-72 custom-scrollbar">Fetching live migration metrics...</pre>
    </section>

  </main>

  <script>
    async function fetchStatus() {
      const inputVal = document.getElementById('job-id-input').value.trim();
      const targetId = inputVal || 'latest';

      try {
        const res = await fetch('/v1/admin/migrations/status/' + targetId);
        const json = await res.json();
        
        document.getElementById('raw-json').textContent = JSON.stringify(json, null, 2);

        if (json.data) {
          const d = json.data;

          if (d.jobId && d.jobId !== 'none' && !inputVal) {
            document.getElementById('job-id-input').value = d.jobId;
          }

          document.getElementById('job-state').textContent = (d.state || 'idle').toUpperCase();
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
        }
      } catch (err) {
        document.getElementById('raw-json').textContent = 'Error fetching status: ' + err.message;
      }
    }

    function clearAndFetchLatest() {
      document.getElementById('job-id-input').value = '';
      fetchStatus();
    }

    // Auto-poll every 2 seconds
    setInterval(fetchStatus, 2000);

    // Initial load
    fetchStatus();
  </script>
</body>
</html>`;
}
