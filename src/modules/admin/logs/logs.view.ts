import { html } from 'hono/html';

export function renderLogsView() {
  return html`<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ck logs</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Fira+Code:wght@400&display=swap" rel="stylesheet">
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
      font-weight: 400;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0a0a0a;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #1f1f1f;
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #333333;
    }
  </style>
</head>
<body class="bg-neutral-950 text-neutral-200 min-h-full flex flex-col font-normal antialiased">

  <!-- Main Navbar (Aligned with Docs UI Theme) -->
  <nav class="bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex flex-col gap-4 shrink-0">
    <!-- Top Row: Logo & Action Buttons -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <!-- Docs-Inspired Indigo Badge -->
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-normal text-neutral-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <h1 class="text-neutral-50 text-base font-normal tracking-wide font-mono">logs</h1>
      </div>
      <div class="flex items-center gap-1.5">
        <button id="downloadBtn" class="bg-transparent hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-neutral-300 text-sm px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors font-normal" title="Download Log File">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download
        </button>
        <button id="cleanBtn" class="bg-transparent hover:bg-neutral-900 border border-neutral-900 hover:border-neutral-800 text-neutral-300 text-sm px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors font-normal" title="Empty Log File Contents">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M6.34 17.66l-1.41 1.41M12 20v2M17.66 17.66l1.41 1.41M20 12h2M17.66 6.34l-1.41-1.41M19 12A7 7 0 1 1 5 12a7 7 0 0 1 14 0Z"/></svg>
          Clean
        </button>
        <button id="deleteBtn" class="bg-transparent hover:bg-red-955/10 border border-neutral-900 text-red-400 text-sm px-3 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors font-normal" title="Delete Log File">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
          Delete
        </button>
        <!-- Primary Action styled in rich Indigo from Docs Page -->
        <button id="refreshBtn" class="bg-indigo-600 hover:bg-indigo-700 text-neutral-50 text-sm px-4 py-1.5 rounded inline-flex items-center gap-1.5 transition-colors font-normal shadow-sm shadow-indigo-600/10" title="Refresh Logs">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l6.73-5.19"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Bottom Row: Query Controls & Level Filters -->
    <div class="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
      <div class="flex flex-wrap items-center gap-4 flex-1">
        <!-- Log File Dropdown -->
        <div class="relative">
          <select id="logFileSelect" class="bg-neutral-950 border border-neutral-900 hover:border-neutral-850 text-neutral-300 text-sm px-3 py-1.5 pr-8 rounded outline-none cursor-pointer appearance-none font-mono focus:border-indigo-500">
            <option value="">Loading files...</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-neutral-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>

        <!-- Level Filters -->
        <div class="flex items-center gap-1.5 overflow-x-auto">
          <button class="filter-btn bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-sm px-3 py-1 rounded transition-all font-normal active" data-level="all">All</button>
          <button class="filter-btn bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-sm px-3 py-1 rounded transition-all font-normal" data-level="error">Error</button>
          <button class="filter-btn bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-sm px-3 py-1 rounded transition-all font-normal" data-level="warning">Warning</button>
          <button class="filter-btn bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-sm px-3 py-1 rounded transition-all font-normal" data-level="info">Info</button>
          <button class="filter-btn bg-neutral-950 border border-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 text-sm px-3 py-1 rounded transition-all font-normal" data-level="debug">Debug</button>
        </div>
      </div>

      <!-- Right Side Inputs (Playground style) -->
      <div class="flex items-center gap-3">
        <input type="text" id="logSearchInput" placeholder="Search logs..." class="bg-neutral-950 border border-neutral-900 focus:border-indigo-500 focus:ring-0 text-neutral-300 text-sm px-3 py-1.5 rounded outline-none placeholder-neutral-750 w-full lg:w-64 font-normal">
        
        <div class="relative shrink-0">
          <select id="logLimitSelect" class="bg-neutral-950 border border-neutral-900 hover:border-neutral-850 text-neutral-300 text-sm px-3 py-1.5 pr-8 rounded outline-none cursor-pointer appearance-none font-normal focus:border-indigo-500">
            <option value="10">Show 10</option>
            <option value="25">Show 25</option>
            <option value="50">Show 50</option>
            <option value="100" selected>Show 100</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-neutral-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- Main View Area (Borderless flat list) -->
  <main class="flex-1 flex flex-col relative overflow-hidden bg-neutral-950">
    
    <!-- Loading overlay -->
    <div id="loadingOverlay" class="absolute inset-0 bg-neutral-950/70 backdrop-blur-[1px] flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-200 z-30">
      <div class="w-8 h-8 border-2 border-neutral-800 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>

    <div class="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
      <table class="w-full text-left border-collapse font-mono text-sm">
        <thead>
          <tr class="bg-neutral-950 text-neutral-500 border-b border-neutral-900 select-none">
            <th class="px-6 py-3.5 font-normal uppercase tracking-wider text-xs w-[120px]">Level</th>
            <th class="px-6 py-3.5 font-normal uppercase tracking-wider text-xs w-[200px]">Date</th>
            <th class="px-6 py-3.5 font-normal uppercase tracking-wider text-xs">Message</th>
          </tr>
        </thead>
        <tbody id="logsTableBody" class="divide-y divide-neutral-900/60">
          <!-- Dynamically populated -->
        </tbody>
      </table>
    </div>

    <!-- Footer / Pagination -->
    <div class="bg-neutral-950 border-t border-neutral-900 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 select-none">
      <div id="paginationIndicator" class="text-neutral-500 text-sm font-normal">
        Loading logs summary...
      </div>
      <div class="flex items-center gap-1.5">
        <button id="prevPageBtn" class="bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm px-3 py-1 rounded transition-colors disabled:opacity-40 disabled:hover:bg-neutral-900 disabled:cursor-not-allowed font-normal" disabled>Previous</button>
        <span id="currentPageNum" class="text-neutral-300 text-sm px-3 font-normal">1</span>
        <button id="nextPageBtn" class="bg-neutral-900 border border-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm px-3 py-1 rounded transition-colors disabled:opacity-40 disabled:hover:bg-neutral-900 disabled:cursor-not-allowed font-normal" disabled>Next</button>
      </div>
    </div>
  </main>

  <script>
    // Extract token from URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('jwt_token', urlToken);
      // Clean up the token query parameter from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    function getAuthToken() {
      return localStorage.getItem('jwt_token') || '';
    }

    function getHeaders() {
      const token = getAuthToken();
      return token ? { 'Authorization': 'Bearer ' + token } : {};
    }

    // State management
    let state = {
      files: [],
      selectedFile: '',
      searchQuery: '',
      selectedLevel: 'all',
      limit: 100,
      page: 1,
      totalPages: 1,
      totalCount: 0,
      fileSizeKb: 0
    };

    // DOM Elements
    const logFileSelect = document.getElementById('logFileSelect');
    const logSearchInput = document.getElementById('logSearchInput');
    const logLimitSelect = document.getElementById('logLimitSelect');
    const logsTableBody = document.getElementById('logsTableBody');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const paginationIndicator = document.getElementById('paginationIndicator');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageNum = document.getElementById('currentPageNum');
    
    // Action Buttons
    const downloadBtn = document.getElementById('downloadBtn');
    const cleanBtn = document.getElementById('cleanBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Level Filters
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Initialize View
    async function init() {
      const token = getAuthToken();
      if (!token) {
        renderEmptyState('Unauthorized: Missing or invalid token. Please log in at the Interactive API Docs (/docs) first, or pass the token in the URL: /admin/logs?token=YOUR_TOKEN');
        alert('You are not logged in. Please login via the Interactive Docs (/docs) first, or visit /admin/logs?token=YOUR_JWT_TOKEN');
        window.location.href = '/docs';
        return;
      }

      // Setup events
      logFileSelect.addEventListener('change', (e) => {
        state.selectedFile = e.target.value;
        state.page = 1;
        fetchLogs();
      });

      logLimitSelect.addEventListener('change', (e) => {
        state.limit = parseInt(e.target.value, 10);
        state.page = 1;
        fetchLogs();
      });

      let searchTimeout;
      logSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          state.searchQuery = e.target.value;
          state.page = 1;
          fetchLogs();
        }, 300);
      });

      filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          filterButtons.forEach(b => {
            b.classList.remove('active', 'border-red-900/40', 'bg-red-950/20', 'text-red-400', 'border-amber-900/40', 'bg-amber-950/20', 'text-amber-400', 'border-emerald-900/40', 'bg-emerald-950/20', 'text-emerald-400', 'border-indigo-900/40', 'bg-indigo-950/20', 'text-indigo-400', 'border-neutral-500', 'bg-neutral-800', 'text-neutral-200');
            b.classList.add('bg-neutral-950', 'border-neutral-900', 'text-neutral-400');
          });
          
          btn.classList.remove('bg-neutral-950', 'border-neutral-900', 'text-neutral-400');
          
          const level = btn.dataset.level;
          if (level === 'all') {
            btn.classList.add('border-indigo-900/40', 'bg-indigo-950/20', 'text-indigo-400');
          } else if (level === 'error') {
            btn.classList.add('bg-red-955/10', 'border-red-900/40', 'text-red-400');
          } else if (level === 'warning') {
            btn.classList.add('bg-amber-955/10', 'border-amber-900/40', 'text-amber-400');
          } else if (level === 'info') {
            btn.classList.add('bg-emerald-955/10', 'border-emerald-900/40', 'text-emerald-400');
          } else {
            btn.classList.add('bg-neutral-800', 'border-neutral-700', 'text-neutral-300');
          }

          state.selectedLevel = level;
          state.page = 1;
          fetchLogs();
        });
      });

      // Set initial 'all' styling to Docs Indigo Theme
      const allBtn = document.querySelector('[data-level="all"]');
      if (allBtn) {
        allBtn.classList.remove('bg-neutral-950', 'border-neutral-900', 'text-neutral-400');
        allBtn.classList.add('border-indigo-900/40', 'bg-indigo-955/10', 'text-indigo-400');
      }

      prevPageBtn.addEventListener('click', () => {
        if (state.page > 1) {
          state.page--;
          fetchLogs();
        }
      });

      nextPageBtn.addEventListener('click', () => {
        if (state.page < state.totalPages) {
          state.page++;
          fetchLogs();
        }
      });

      // Bind actions
      refreshBtn.addEventListener('click', fetchLogs);
      downloadBtn.addEventListener('click', downloadLogFile);
      cleanBtn.addEventListener('click', cleanLogFile);
      deleteBtn.addEventListener('click', deleteLogFile);

      // Load initial files list
      await fetchLogFiles();
    }

    function showLoading(show) {
      if (show) loadingOverlay.classList.add('opacity-100', 'pointer-events-auto');
      else loadingOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    }

    // Helper to check response status
    function handleUnauthorized(res) {
      if (res.status === 401) {
        alert('Session expired or unauthorized. Redirecting to Interactive Docs...');
        window.location.href = '/docs';
        return true;
      }
      return false;
    }

    // API Calls
    async function fetchLogFiles() {
      showLoading(true);
      try {
        const res = await fetch('/v1/admin/logs/files', {
          headers: getHeaders()
        });
        if (handleUnauthorized(res)) return;

        const json = await res.json();
        if (json.status === 'success' && json.data.length > 0) {
          state.files = json.data;
          
          // Populate select
          logFileSelect.innerHTML = state.files.map(file => 
            \`<option value="\${file}">\${file}</option>\`
          ).join('');
          
          state.selectedFile = state.files[0];
          fetchLogs();
        } else {
          logFileSelect.innerHTML = '<option value="">No log files found</option>';
          renderEmptyState('No log files available.');
          showLoading(false);
        }
      } catch (err) {
        console.error('Failed to load log files', err);
        logFileSelect.innerHTML = '<option value="">Error loading files</option>';
        showLoading(false);
      }
    }

    async function fetchLogs() {
      if (!state.selectedFile) return;
      showLoading(true);
      
      const params = new URLSearchParams({
        file: state.selectedFile,
        q: state.searchQuery,
        level: state.selectedLevel,
        limit: state.limit.toString(),
        page: state.page.toString()
      });

      try {
        const res = await fetch(\`/v1/admin/logs/data?\${params.toString()}\`, {
          headers: getHeaders()
        });
        if (handleUnauthorized(res)) return;

        const json = await res.json();
        showLoading(false);

        if (json.status === 'success') {
          renderLogs(json.data.logs);
          
          state.totalPages = json.data.pagination.totalPages;
          state.totalCount = json.data.pagination.totalCount;
          state.fileSizeKb = json.data.fileSizeKb;
          
          updatePaginationUI();
        } else {
          renderEmptyState(json.message || 'Failed to parse logs.');
        }
      } catch (err) {
        console.error(err);
        renderEmptyState('Error loading log data.');
        showLoading(false);
      }
    }

    // UI Renders
    function renderLogs(logs) {
      if (!logs || logs.length === 0) {
        renderEmptyState('No log entries matching the filters.');
        return;
      }

      logsTableBody.innerHTML = '';
      
      logs.forEach((log, index) => {
        const rowId = \`log-row-\${index}\`;
        
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-neutral-900/40 cursor-pointer border-l border-b border-neutral-900/40 transition-all';
        tr.id = rowId;
        
        const levelStyle = getLevelStyles(log.level);
        tr.classList.add(levelStyle.border);
        
        const formattedDate = formatDate(log.timestamp);
        
        tr.innerHTML = \`
          <td class="px-6 py-2.5 font-normal"><span class="\${levelStyle.badge}">\${log.level}</span></td>
          <td class="px-6 py-2.5 text-neutral-500 font-normal text-xs">\-- \${formattedDate}</td>
          <td class="px-6 py-2.5 text-neutral-350 break-all font-normal text-sm">\${escapeHtml(log.message)}</td>
        \`;
        
        // Toggle details panel
        tr.addEventListener('click', () => {
          toggleDetails(tr, log, index);
        });
        
        logsTableBody.appendChild(tr);
      });
    }

    function toggleDetails(rowElement, log, index) {
      const nextRow = rowElement.nextElementSibling;
      const isExpanded = rowElement.classList.contains('bg-neutral-900/20');
      
      // Collapse if already expanded
      if (isExpanded && nextRow && nextRow.classList.contains('details-row')) {
        rowElement.classList.remove('bg-neutral-900/20');
        nextRow.remove();
        return;
      }
      
      // Expand details
      rowElement.classList.add('bg-neutral-900/20');
      
      const detailsRow = document.createElement('tr');
      detailsRow.className = 'details-row bg-neutral-950';
      
      let metaItemsHtml = '';
      if (log.meta) {
        for (const [key, val] of Object.entries(log.meta)) {
          if (key === 'stack') continue;
          metaItemsHtml += \`
            <div class="inline-flex items-center gap-1.5 bg-neutral-900/30 border border-neutral-900/50 px-2 py-0.5 rounded text-xs">
              <span class="text-neutral-500 font-normal">\${key}:</span>
              <span class="text-neutral-300 font-normal">\${escapeHtml(String(val))}</span>
            </div>
          \`;
        }
      }

      const hasMeta = !!metaItemsHtml;
      const hasStack = log.meta && log.meta.stack;

      detailsRow.innerHTML = \`
        <td colspan="3" class="px-6 py-4 border-b border-neutral-900">
          <div class="flex flex-col gap-3">
            <div class="flex flex-wrap gap-2 items-center text-xs text-neutral-500 font-normal">
              <div class="inline-flex items-center gap-1.5 bg-neutral-900/30 border border-neutral-900/50 px-2 py-0.5 rounded">
                <span class="text-neutral-500">Timestamp:</span>
                <span class="text-neutral-300">\${log.timestamp}</span>
              </div>
              \${metaItemsHtml}
            </div>
            
            \${hasStack ? \`
              <div class="bg-neutral-950 border border-neutral-900 rounded p-4 overflow-x-auto max-w-full">
                <div class="text-[10px] uppercase tracking-wider text-red-500/80 mb-2 font-normal">Stack Trace</div>
                <pre class="text-red-400 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all"><code>\${escapeHtml(log.meta.stack)}</code></pre>
              </div>
            \` : ''}
            
            \${(!hasStack && log.meta && Object.keys(log.meta).length > 0) ? \`
              <div class="bg-neutral-950 border border-neutral-900 rounded p-4 overflow-x-auto max-w-full">
                <div class="text-[10px] uppercase tracking-wider text-indigo-500/80 mb-2 font-normal">Metadata Object</div>
                <pre class="text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all"><code>\${escapeHtml(JSON.stringify(log.meta, null, 2))}</code></pre>
              </div>
            \` : ''}
          </div>
        </td>
      \`;
      
      rowElement.after(detailsRow);
    }

    function renderEmptyState(message) {
      logsTableBody.innerHTML = \`
        <tr>
          <td colspan="3" class="px-6 py-12 text-center text-neutral-500">
            <div class="flex flex-col items-center gap-2">
              <svg class="w-8 h-8 stroke-neutral-650 opacity-60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"/></svg>
              <p class="font-normal text-sm">\${escapeHtml(message)}</p>
            </div>
          </td>
        </tr>
      \`;
    }

    function updatePaginationUI() {
      currentPageNum.textContent = state.page;
      prevPageBtn.disabled = state.page <= 1;
      nextPageBtn.disabled = state.page >= state.totalPages;
      
      const startEntry = state.totalCount === 0 ? 0 : (state.page - 1) * state.limit + 1;
      const endEntry = Math.min(state.page * state.limit, state.totalCount);
      
      paginationIndicator.textContent = \`Showing \${startEntry} to \${endEntry} of \${state.totalCount} entries (\${state.fileSizeKb.toFixed(2)} KB)\`;
    }

    // Helper functions
    function getLevelStyles(level) {
      level = String(level).toLowerCase();
      if (level === 'error' || level === 'critical' || level === 'emergency') {
        return {
          border: 'border-l-red-500/50',
          badge: 'text-red-400'
        };
      }
      if (level === 'warning') {
        return {
          border: 'border-l-amber-500/50',
          badge: 'text-amber-400'
        };
      }
      if (level === 'debug') {
        return {
          border: 'border-l-neutral-650',
          badge: 'text-neutral-500'
        };
      }
      return {
        border: 'border-l-emerald-500/50',
        badge: 'text-emerald-400'
      };
    }

    function formatDate(isoStr) {
      try {
        const date = new Date(isoStr);
        return date.toLocaleDateString(undefined, { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) + ' ' + date.toLocaleTimeString(undefined, { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        });
      } catch (e) {
        return isoStr;
      }
    }

    function escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // File Action Calls
    async function downloadLogFile() {
      if (!state.selectedFile) return;
      window.open(\`/v1/admin/logs/\${state.selectedFile}/download?token=\${getAuthToken()}\`, '_blank');
    }

    async function cleanLogFile() {
      if (!state.selectedFile) return;
      if (!confirm(\`Are you sure you want to clean the file: \${state.selectedFile}? This will erase all its logs.\`)) return;
      
      showLoading(true);
      try {
        const res = await fetch(\`/v1/admin/logs/\${state.selectedFile}/clear\`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (handleUnauthorized(res)) return;

        const json = await res.json();
        if (json.status === 'success') {
          alert('Log file cleared successfully.');
          fetchLogs();
        } else {
          alert(json.message || 'Failed to clear log file.');
          showLoading(false);
        }
      } catch (err) {
        console.error(err);
        alert('Error clearing log file.');
        showLoading(false);
      }
    }

    async function deleteLogFile() {
      if (!state.selectedFile) return;
      if (!confirm(\`Are you sure you want to delete the file: \${state.selectedFile}? This action is irreversible.\`)) return;
      
      showLoading(true);
      try {
        const res = await fetch(\`/v1/admin/logs/\${state.selectedFile}\`, {
          method: 'DELETE',
          headers: getHeaders()
        });
        if (handleUnauthorized(res)) return;

        const json = await res.json();
        if (json.status === 'success') {
          alert('Log file deleted successfully.');
          await fetchLogFiles();
        } else {
          alert(json.message || 'Failed to delete log file.');
          showLoading(false);
        }
      } catch (err) {
        console.error(err);
        alert('Error deleting log file.');
        showLoading(false);
      }
    }

    // Launch
    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>`;
}
