export function getChangelogHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Changelog - Codekaro Dev Portal</title>
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
<body class="bg-zinc-950 text-zinc-200 antialiased min-h-screen flex flex-col font-normal custom-scrollbar">

  <!-- Header Navigation -->
  <header class="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/80 backdrop-blur">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center font-bold text-zinc-50 text-sm tracking-tight shadow-lg shadow-indigo-600/30">CK</div>
        <span class="text-zinc-50 font-semibold tracking-wide text-sm font-mono">dev portal</span>
      </div>
      <div class="flex items-center space-x-6">
        <a href="/docs" class="text-xs text-zinc-400 hover:text-indigo-400 transition font-mono">← Back to Docs</a>
        <span class="h-4 w-px bg-zinc-800"></span>
        <span class="text-xs font-mono text-zinc-500">API Version: 1.1.0</span>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="flex-grow max-w-5xl w-full mx-auto px-6 py-12">
    <!-- Hero Header -->
    <div class="mb-16 text-center max-w-2xl mx-auto">
      <div class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-4 tracking-wide uppercase">
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span>Latest Update: July 9, 2026</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight text-zinc-50 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400">
        Codekaro API Changelog
      </h1>
      <p class="text-sm text-zinc-400 leading-relaxed font-sans">
        Keep track of new features, schema updates, and endpoint releases on the Codekaro backend platform.
      </p>
    </div>

    <!-- Timeline Entries -->
    <div class="relative border-l border-zinc-800 ml-4 md:ml-32 space-y-16">
      
      <!-- Release Entry: v1.1.0 -->
      <div class="relative pl-8 group">
        <!-- Badge Indicator on Timeline -->
        <span class="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-zinc-950 shadow-md">
          <svg class="h-2 w-2 text-zinc-50" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>
        </span>

        <!-- Floating Date Left on Desktop -->
        <div class="hidden md:block absolute -left-36 top-1 text-right w-28">
          <span class="text-xs font-mono text-indigo-400 font-semibold block">v1.1.0</span>
          <span class="text-[10px] font-mono text-zinc-500 block">July 9, 2026</span>
        </div>

        <!-- Mobile Date/Version Info -->
        <div class="md:hidden flex items-center space-x-2 mb-2 font-mono text-xs">
          <span class="text-indigo-400 font-semibold">v1.1.0</span>
          <span class="text-zinc-600">•</span>
          <span class="text-zinc-500">July 9, 2026</span>
        </div>

        <!-- Release Card -->
        <div class="bg-zinc-900/40 border border-zinc-900 rounded-xl p-6 md:p-8 hover:border-zinc-800 transition shadow-sm">
          <h2 class="text-lg font-semibold text-zinc-50 mb-2 flex items-center gap-3">
            <span>Analytics Overview Enhancements</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
          </h2>
          <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
            Upgraded the analytics overview endpoint to return compared data (current vs. previous timeframe) and UTC-aligned trend history arrays for rendering React frontend graphs/sparklines.
          </p>

          <!-- API Endpoint details -->
          <div class="bg-zinc-950/60 border border-zinc-900 rounded-lg p-4 mb-6 font-mono text-xs">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">GET</span>
              <span class="text-zinc-200 font-semibold">/v1/admin/analytics/overview</span>
              <span class="text-[9px] font-sans px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">ADMIN ACCESS REQUIRED</span>
            </div>
          </div>

          <!-- Query Parameters -->
          <div class="mb-6">
            <h3 class="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3">Query Parameters</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-zinc-400 border-collapse">
                <thead>
                  <tr class="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                    <th class="py-2 pr-4 font-semibold">Param</th>
                    <th class="py-2 pr-4 font-semibold">Type</th>
                    <th class="py-2 pr-4 font-semibold">Default</th>
                    <th class="py-2 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-zinc-800/40">
                  <tr>
                    <td class="py-2 pr-4 font-mono text-indigo-400 font-medium">range</td>
                    <td class="py-2 pr-4 font-mono text-zinc-500">enum</td>
                    <td class="py-2 pr-4 font-mono text-zinc-600">last7Days</td>
                    <td class="py-2 leading-relaxed">
                      Presets: <code class="font-mono text-zinc-300">today</code>, <code class="font-mono text-zinc-300">yesterday</code>, <code class="font-mono text-zinc-300">thisMonth</code>, <code class="font-mono text-zinc-300">lastMonth</code>, <code class="font-mono text-zinc-300">last7Days</code>, <code class="font-mono text-zinc-300">thisYear</code>, <code class="font-mono text-zinc-300">custom</code>.
                    </td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-4 font-mono text-indigo-400 font-medium">startDate</td>
                    <td class="py-2 pr-4 font-mono text-zinc-500">string</td>
                    <td class="py-2 pr-4 font-mono text-zinc-600">-</td>
                    <td class="py-2">Start date in <code class="font-mono text-zinc-300">YYYY-MM-DD</code> format (required for <code class="font-mono text-zinc-300">custom</code> preset).</td>
                  </tr>
                  <tr>
                    <td class="py-2 pr-4 font-mono text-indigo-400 font-medium">endDate</td>
                    <td class="py-2 pr-4 font-mono text-zinc-500">string</td>
                    <td class="py-2 pr-4 font-mono text-zinc-600">-</td>
                    <td class="py-2">End date in <code class="font-mono text-zinc-300">YYYY-MM-DD</code> format (required for <code class="font-mono text-zinc-300">custom</code> preset).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payload Schema -->
          <div class="mb-8">
            <details class="group bg-zinc-900/20 border border-zinc-900 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-zinc-900/40 transition select-none">
                <span class="text-sm font-semibold text-zinc-200">Response Payload Schema</span>
                <span class="transition-transform duration-200 group-open:-rotate-180">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-500 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div class="p-6 border-t border-zinc-900/60 bg-zinc-950/20">
                <!-- Json description -->
                <p class="text-xs text-zinc-400 mb-4 leading-relaxed">
                  The response has been upgraded so that each metric card contains an object instead of a raw number, delivering both historical context and graph trends.
                </p>
                
                <!-- Code block header -->
                <div class="flex items-center justify-between px-4 py-2 border border-zinc-900 bg-zinc-900/20 rounded-t-lg">
                  <span class="text-[10px] font-mono text-zinc-500">application/json</span>
                  <button onclick="copyToClipboard('json-response')" class="text-[10px] text-zinc-500 hover:text-indigo-400 font-mono transition">Copy JSON</button>
                </div>

                <!-- JSON structure -->
                <pre id="json-response" class="font-mono text-[11px] text-zinc-300 overflow-x-auto border-x border-b border-zinc-900 p-4 rounded-b-lg bg-zinc-950/60 custom-scrollbar leading-5"><code>{
  "status": "success",
  "data": {
    "metrics": {
      "usersSignedUp": {
        "current": 10,
        "previous": 8,
        "percentageChange": 25,
        "direction": "up",
        "trend": [
          { "label": "Jul 01", "value": 1 },
          { "label": "Jul 02", "value": 2 },
          { "label": "Jul 03", "value": 0 }
        ]
      },
      "coursesEnrolled": {
        "current": 5,
        "previous": 6,
        "percentageChange": -16.67,
        "direction": "down",
        "trend": [
          { "label": "Jul 01", "value": 0 },
          { "label": "Jul 02", "value": 3 }
        ]
      },
      "revenue": {
        "current": 25000,
        "previous": 20000,
        "percentageChange": 25,
        "direction": "up",
        "trend": [
          { "label": "Jul 01", "value": 5000 },
          { "label": "Jul 02", "value": 15000 }
        ]
      }
    },
    "list": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5
    },
    "timeframe": {
      "from": "2026-07-01T00:00:00.000Z",
      "to": "2026-07-09T23:59:59.999Z"
    },
    "comparisonTimeframe": {
      "from": "2026-06-01T00:00:00.000Z",
      "to": "2026-06-09T23:59:59.999Z"
    }
  }
}</code></pre>
              </div>
            </details>
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-600 font-mono">
    &copy; 2026 Codekaro. Constructed for Developer Portability.
  </footer>

  <script>
    function copyToClipboard(id) {
      const el = document.getElementById(id);
      const text = el.innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard successfully!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }
  </script>
</body>
</html>`;
}
