import {
  ACCESS_LABEL,
  BASE_URL,
  esc,
  fetchSnippet,
  fullPath,
  md,
  type Access,
  type Endpoint,
  type Item,
  type Method,
  type Page,
  type Param,
} from './kit.js';

export const DOCS_ROOT = '/docs/v2';

export const GROUP_ORDER = [
  'Getting started',
  'Public',
  'Student',
  'Payments',
  'Admin',
  'Operations',
  'Reference',
];

export const urlFor = (page: Page) => (page.path ? `${DOCS_ROOT}/${page.path}` : DOCS_ROOT);

// ---------- badges ----------

const METHOD_CLASS: Record<Method, string> = {
  GET: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  POST: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  PUT: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  PATCH: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
  DELETE: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
};

const ACCESS_CLASS: Record<Access, string> = {
  public: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  optional: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/30',
  user: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/30',
  admin: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-300 dark:ring-fuchsia-500/30',
  webhook: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:ring-orange-500/30',
  'open-admin': 'bg-red-50 text-red-700 ring-red-300 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/40',
};

const methodBadge = (m: Method, small = false) =>
  `<span class="inline-flex items-center justify-center rounded font-mono font-semibold ${small ? 'w-14 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'} ${METHOD_CLASS[m]}">${m}</span>`;

const accessBadge = (a: Access) =>
  `<span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${ACCESS_CLASS[a]}">${esc(ACCESS_LABEL[a])}</span>`;

// ---------- content blocks ----------

// Editor-style block: window chrome, language tag, copy button. Highlighted client-side by highlight.js.
const codeBlock = (code: string, label = '', lang = 'javascript') => `
<div class="editor my-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
  <div class="editor-bar flex items-center gap-3 border-b border-slate-200 px-3 py-2 dark:border-slate-800">
    <span class="flex gap-1.5" aria-hidden="true"><i class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></i><i class="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></i><i class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></i></span>
    <span class="flex-1 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">${esc(label)}</span>
    <span class="rounded bg-slate-200/70 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">${esc(lang)}</span>
    <button type="button" data-copy class="rounded border border-slate-300 px-2 py-0.5 text-[11px] text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Copy</button>
  </div>
  <pre class="editor-body overflow-x-auto p-4 text-[12.5px] leading-relaxed"><code class="language-${esc(lang)} font-mono">${esc(code)}</code></pre>
</div>`;

export const jsonBlock = (value: unknown, label: string) => codeBlock(JSON.stringify(value, null, 2), label, 'json');

const paramTable = (title: string, rows: Param[]) => {
  if (!rows.length) return '';
  return `
<div class="mt-5">
  <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">${esc(title)}</h4>
  <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
    <table class="w-full min-w-[34rem] text-left text-sm">
      <thead class="bg-slate-50 text-xs text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
        <tr><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Required</th><th class="px-3 py-2 font-medium">Description</th></tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
        ${rows
          .map(
            (r) => `<tr class="align-top">
          <td class="px-3 py-2 font-mono text-[13px] text-slate-900 dark:text-slate-100">${esc(r.name)}</td>
          <td class="px-3 py-2 font-mono text-xs text-indigo-700 dark:text-indigo-300">${esc(r.type)}</td>
          <td class="px-3 py-2 text-xs ${r.req === 'required' ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}">${esc(r.req)}</td>
          <td class="px-3 py-2 text-slate-600 dark:text-slate-300">${md(r.desc)}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>
  </div>
</div>`;
};

const statusClass = (n: number) =>
  n < 300
    ? 'text-emerald-700 dark:text-emerald-300'
    : n < 500
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-rose-700 dark:text-rose-300';

function renderEndpoint(e: Endpoint): string {
  const path = fullPath(e);
  const notes = (e.notes ?? [])
    .map(
      (n) =>
        `<li class="flex gap-2"><span class="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-indigo-400"></span><span>${md(n)}</span></li>`
    )
    .join('');
  const warn =
    e.access === 'open-admin'
      ? `<div class="mt-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"><strong>No authentication.</strong> This route sits under an admin-style URL but the router does not apply <code class="ic">authMiddleware</code> / <code class="ic">adminMiddleware</code>. Anyone who can reach the API can call it. See <a class="underline" href="/docs/v2/reference/access-control">Access control</a>.</div>`
      : '';
  const resp = e.response
    ? `<div class="mt-5"><h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Response <span class="ml-1 font-mono ${statusClass(e.response.status)}">${e.response.status}</span></h4>${e.response.note ? `<p class="text-sm text-slate-600 dark:text-slate-300">${md(e.response.note)}</p>` : ''}${e.response.example !== undefined ? jsonBlock(e.response.example, 'Example') : ''}</div>`
    : '';
  const errors = e.errors?.length
    ? `<div class="mt-5"><h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Errors</h4><ul class="space-y-1 text-sm">${e.errors
        .map(
          ([s, m]) =>
            `<li class="flex gap-3"><span class="w-9 flex-none font-mono ${statusClass(s)}">${s}</span><span class="text-slate-600 dark:text-slate-300">${md(m)}</span></li>`
        )
        .join('')}</ul></div>`
    : '';

  return `
<article id="${esc(e.id)}" class="ep scroll-mt-20 border-t border-slate-200 py-8 first:border-t-0 dark:border-slate-800" data-title="${esc(e.title)}">
  <div class="flex flex-wrap items-center gap-2">
    <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-50"><a href="#${esc(e.id)}" class="hover:underline">${esc(e.title)}</a></h3>
    ${accessBadge(e.access)}
  </div>
  <div class="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-800 dark:bg-slate-900/60">
    ${methodBadge(e.method)}
    <span class="break-all text-slate-800 dark:text-slate-200">${esc(path).replace(/(:[A-Za-z]+)/g, '<span class="text-indigo-600 dark:text-indigo-300">$1</span>')}</span>
  </div>
  <p class="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300">${md(e.desc)}</p>
  ${warn}
  ${notes ? `<ul class="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">${notes}</ul>` : ''}
  ${paramTable('Path parameters', e.pathParams ?? [])}
  ${paramTable('Query parameters', e.query ?? [])}
  ${paramTable('Headers', e.headers ?? [])}
  ${paramTable('Request body (JSON)', e.body ?? [])}
  ${e.bodyExample !== undefined ? jsonBlock(e.bodyExample, 'Request body example') : ''}
  ${codeBlock(fetchSnippet(e), 'fetch example', 'javascript')}
  ${resp}
  ${errors}
</article>`;
}

function renderItem(item: Item): string {
  switch (item.kind) {
    case 'endpoint':
      return renderEndpoint(item.ep);
    case 'section':
      return `<section id="${esc(item.id)}" class="scroll-mt-20 pt-10 first:pt-0"><h2 class="border-b border-slate-200 pb-2 text-xl font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-50"><a href="#${esc(item.id)}" class="hover:underline">${esc(item.title)}</a></h2>${item.html ? `<div class="prose-doc mt-4">${item.html}</div>` : ''}</section>`;
    case 'html':
      return `<div class="prose-doc my-4">${item.html}</div>`;
  }
}

// ---------- search index ----------

export interface SearchEntry {
  t: string; // title
  m?: Method;
  p?: string; // path
  u: string; // url
  g: string; // page title
}

export function buildSearchIndex(pages: Page[]): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const page of pages) {
    out.push({ t: page.title, u: urlFor(page), g: page.group });
    for (const item of page.items) {
      if (item.kind === 'endpoint') {
        out.push({ t: item.ep.title, m: item.ep.method, p: fullPath(item.ep), u: `${urlFor(page)}#${item.ep.id}`, g: page.title });
      } else if (item.kind === 'section') {
        out.push({ t: item.title, u: `${urlFor(page)}#${item.id}`, g: page.title });
      }
    }
  }
  return out;
}

// ---------- shell ----------

function sidebar(pages: Page[], current: Page): string {
  const groups = GROUP_ORDER.map((g) => ({ g, pages: pages.filter((p) => p.group === g) })).filter((x) => x.pages.length);
  return groups
    .map(
      ({ g, pages: ps }) => `
<div class="mb-5">
  <p class="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">${esc(g)}</p>
  <ul class="space-y-0.5">
    ${ps
      .map((p) => {
        const active = p.path === current.path;
        return `<li><a href="${urlFor(p)}" class="${active ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'} block rounded-md px-2 py-1.5 text-sm" ${active ? 'aria-current="page"' : ''}>${esc(p.title)}</a></li>`;
      })
      .join('')}
  </ul>
</div>`
    )
    .join('');
}

function pager(pages: Page[], current: Page): string {
  const ordered = GROUP_ORDER.flatMap((g) => pages.filter((p) => p.group === g));
  const i = ordered.findIndex((p) => p.path === current.path);
  const prev = i > 0 ? ordered[i - 1] : null;
  const next = i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null;
  const card = (p: typeof prev, dir: 'Previous' | 'Next') =>
    p
      ? `<a href="${urlFor(p)}" class="flex-1 rounded-lg border border-slate-200 p-4 transition hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500 ${dir === 'Next' ? 'text-right' : ''}"><span class="text-xs text-slate-500 dark:text-slate-400">${dir}</span><span class="mt-0.5 block font-medium text-slate-900 dark:text-slate-100">${esc(p.title)}</span></a>`
      : '<span class="hidden flex-1 sm:block"></span>';
  return `<nav class="mt-14 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row dark:border-slate-800">${card(prev, 'Previous')}${card(next, 'Next')}</nav>`;
}

function onThisPage(page: Page): string {
  const rows = page.items
    .map((item) => {
      if (item.kind === 'endpoint') {
        const e = item.ep;
        return `<a href="#${esc(e.id)}" class="flex items-center gap-2 rounded px-1.5 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60">${methodBadge(e.method, true)}<span class="truncate">${esc(e.title)}</span></a>`;
      }
      if (item.kind === 'section') {
        return `<a href="#${esc(item.id)}" class="block rounded px-1.5 py-1 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800/60">${esc(item.title)}</a>`;
      }
      return '';
    })
    .join('');
  if (!rows.trim()) return '';
  return `<details open class="mt-6 rounded-lg border border-slate-200 p-3 dark:border-slate-800"><summary class="cursor-pointer text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">On this page</summary><div class="mt-2 grid gap-0.5 sm:grid-cols-2">${rows}</div></details>`;
}

const STYLE = `
  :root { color-scheme: light; }
  :root.dark { color-scheme: dark; }
  body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
  code, pre, .font-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
  .ic { border-radius: 4px; padding: 1px 5px; font-size: 0.85em; background: #f3f3f3; color: #1c1c1c; }
  .dark .ic { background: #1c1c1c; color: #e6e6e6; }
  /* editor surface + syntax colours (light / dark) */
  .editor { background: #fafafa; }
  .editor-bar { background: #f3f3f3; }
  .dark .editor { background: #0a0a0a; }
  .dark .editor-bar { background: #111; }
  .editor-body code.hljs { background: transparent; padding: 0; color: #1c1c1c; }
  .dark .editor-body code.hljs { color: #e6e6e6; }
  .hljs-attr, .hljs-property { color: #c2410c; }
  .hljs-string { color: #067a46; }
  .hljs-number, .hljs-literal { color: #b45309; }
  .hljs-keyword, .hljs-built_in, .hljs-title.function_ { color: #0369a1; }
  .hljs-title.class_, .hljs-variable, .hljs-params { color: #1c1c1c; }
  .hljs-comment { color: #8f8f8f; font-style: italic; }
  .hljs-punctuation, .hljs-operator { color: #707070; }
  .dark .hljs-attr, .dark .hljs-property { color: #fdba74; }
  .dark .hljs-string { color: #7ee2b0; }
  .dark .hljs-number, .dark .hljs-literal { color: #ffb86b; }
  .dark .hljs-keyword, .dark .hljs-built_in, .dark .hljs-title.function_ { color: #7dd3fc; }
  .dark .hljs-title.class_, .dark .hljs-variable, .dark .hljs-params { color: #e6e6e6; }
  .dark .hljs-comment { color: #707070; }
  .dark .hljs-punctuation, .dark .hljs-operator { color: #8f8f8f; }
  .prose-doc p { margin: 0.6rem 0; line-height: 1.7; }
  .prose-doc ul { margin: 0.6rem 0; padding-left: 1.2rem; list-style: disc; }
  .prose-doc ol { margin: 0.6rem 0; padding-left: 1.3rem; list-style: decimal; }
  .prose-doc li { margin: 0.25rem 0; line-height: 1.65; }
  .prose-doc a { color: #c2410c; text-decoration: underline; }
  .dark .prose-doc a { color: #fdba74; }
  .prose-doc h3 { margin-top: 1.5rem; font-weight: 600; font-size: 1.05rem; }
  .prose-doc table { width: 100%; font-size: 0.875rem; border-collapse: collapse; }
  .prose-doc th, .prose-doc td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid rgb(226 232 240); vertical-align: top; }
  .dark .prose-doc th, .dark .prose-doc td { border-color: #1c1c1c; }
  .prose-doc th { font-size: 0.75rem; color: #707070; font-weight: 500; background: #fafafa; }
  .dark .prose-doc th { background: #0f0f0f; color: #8f8f8f; }
  .callout { border-left: 3px solid #f97316; background: #fff7ed; padding: 0.75rem 1rem; border-radius: 0 8px 8px 0; margin: 1rem 0; font-size: 0.9rem; }
  .dark .callout { background: rgb(249 115 22 / 0.12); }
  .callout.warn { border-color: rgb(239 68 68); background: rgb(254 242 242); }
  .dark .callout.warn { background: rgb(239 68 68 / 0.1); }
  .tablewrap { overflow-x: auto; border: 1px solid rgb(226 232 240); border-radius: 8px; margin: 1rem 0; }
  .dark .tablewrap { border-color: #1c1c1c; }
`;

const SCRIPT = `
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  function apply(mode) {
    var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', dark);
  }
  function get() { try { return localStorage.getItem('ck-docs-theme') || 'system'; } catch (e) { return 'system'; } }
  apply(get());
  // Two states only: the icon shows the mode you will switch to.
  if (btn) btn.addEventListener('click', function () {
    var next = root.classList.contains('dark') ? 'light' : 'dark';
    try { localStorage.setItem('ck-docs-theme', next); } catch (e) {}
    apply(next);
  });

  // syntax highlighting (highlight.js loads deferred; plain text stays readable if it fails)
  function highlight() { if (window.hljs) document.querySelectorAll('.editor-body code').forEach(function (el) { window.hljs.highlightElement(el); }); }
  if (window.hljs) highlight(); else window.addEventListener('load', highlight);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (get() === 'system') apply('system'); });

  // mobile menu
  var menuBtn = document.getElementById('menu-btn');
  var side = document.getElementById('sidebar');
  if (menuBtn && side) menuBtn.addEventListener('click', function () { side.classList.toggle('hidden'); });

  // copy buttons
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    var box = b.closest('.editor');
    var code = box && box.querySelector('code');
    if (!code) return;
    navigator.clipboard.writeText(code.textContent).then(function () {
      var old = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1200);
    });
  });

  // search
  var idx = JSON.parse(document.getElementById('doc-search-index').textContent);
  var input = document.getElementById('doc-search');
  var results = document.getElementById('doc-search-results');
  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) { results.classList.add('hidden'); results.innerHTML = ''; return; }
    var terms = q.split(/\\s+/);
    var hits = idx.filter(function (x) {
      var hay = (x.t + ' ' + (x.p || '') + ' ' + (x.m || '') + ' ' + x.g).toLowerCase();
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).slice(0, 12);
    if (!hits.length) { results.innerHTML = '<div class="px-3 py-3 text-sm text-slate-500">No results</div>'; results.classList.remove('hidden'); return; }
    results.innerHTML = hits.map(function (h) {
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
      return '<a href="' + esc(h.u) + '" class="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"><div class="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-100">' + (h.m ? '<span class="rounded bg-slate-200 px-1 font-mono text-[10px] dark:bg-slate-700">' + h.m + '</span>' : '') + '<span class="truncate">' + esc(h.t) + '</span></div><div class="truncate font-mono text-[11px] text-slate-500">' + esc(h.p || h.g) + '</div></a>';
    }).join('');
    results.classList.remove('hidden');
  }
  if (input) {
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; render(''); input.blur(); }
      if (e.key === 'Enter') { var a = results.querySelector('a'); if (a) window.location = a.getAttribute('href'); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT') || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); input.focus(); }
    });
    document.addEventListener('click', function (e) { if (!results.contains(e.target) && e.target !== input) results.classList.add('hidden'); });
  }
})();
`;

export function renderPage(page: Page, pages: Page[], searchIndex: SearchEntry[]): string {
  const body = page.items.map(renderItem).join('\n');
  const title = page.path ? `${page.title} · Codekaro API Docs` : 'Codekaro API Docs';
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(page.summary)}">
  <script>
    // Apply the saved theme before first paint to avoid a flash.
    (function () {
      try {
        var m = localStorage.getItem('ck-docs-theme') || 'system';
        if (m === 'dark' || (m === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    // Palette: neutral greys on pure black (codekaro.in), orange accent (chaicode.com).
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { colors: {
        slate: { 50: '#fafafa', 100: '#f3f3f3', 200: '#eeeeee', 300: '#d4d4d4', 400: '#8f8f8f', 500: '#707070', 600: '#525252', 700: '#2b2b2b', 800: '#1c1c1c', 900: '#111111', 950: '#000000' },
        indigo: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
      } } },
    };
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" defer></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Cal+Sans&display=swap" rel="stylesheet">
  <style>${STYLE}</style>
</head>
<body class="bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
    <div class="mx-auto flex h-14 max-w-[88rem] items-center gap-3 px-4">
      <button id="menu-btn" type="button" aria-label="Toggle navigation" class="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <a href="${DOCS_ROOT}" class="flex items-center gap-2 font-semibold">
        <span class="text-xl font-normal tracking-tight" style="font-family: 'Cal Sans', Inter, ui-sans-serif, system-ui, sans-serif">Codekaro</span>
      </a>
      <div class="relative ml-auto w-full max-w-xs">
        <input id="doc-search" type="search" autocomplete="off" placeholder="Search endpoints…  ( / )" class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900">
        <div id="doc-search-results" class="absolute right-0 z-40 mt-1 hidden max-h-96 w-[min(28rem,90vw)] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"></div>
      </div>
      <a href="/playground" class="hidden rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 sm:block dark:text-slate-300 dark:hover:bg-slate-800">Playground</a>
      <button id="theme-toggle" type="button" aria-label="Toggle light / dark mode" title="Toggle light / dark mode" class="rounded-md border border-slate-300 p-1.5 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
        <svg class="h-4 w-4 dark:hidden" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
        <svg class="hidden h-4 w-4 dark:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>
      </button>
    </div>
  </header>

  <div class="mx-auto flex max-w-[88rem] px-4">
    <aside id="sidebar" class="fixed inset-x-0 top-14 z-20 hidden h-[calc(100vh-3.5rem)] w-full overflow-y-auto border-r border-slate-200 bg-white p-4 lg:sticky lg:top-14 lg:block lg:w-64 lg:flex-none lg:bg-transparent lg:pr-4 dark:border-slate-800 dark:bg-slate-950">
      ${sidebar(pages, page)}
    </aside>

    <main class="min-w-0 flex-1 px-0 py-8 lg:pl-10">
      <div class="max-w-4xl">
        <p class="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">${esc(page.group)}</p>
        <h1 class="mt-1 text-3xl font-bold tracking-tight">${esc(page.title)}</h1>
        <p class="mt-2 text-base text-slate-600 dark:text-slate-300">${md(page.summary)}</p>
        <p class="mt-1 font-mono text-xs text-slate-400">Base URL: ${esc(BASE_URL)}</p>
        ${onThisPage(page)}
        <div class="mt-6">${body}</div>
        ${pager(pages, page)}
        <footer class="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">Generated from the backend source. Legacy docs remain at <a class="underline" href="/docs">/docs</a>.</footer>
      </div>
    </main>
  </div>

  <script id="doc-search-index" type="application/json">${JSON.stringify(searchIndex).replace(/</g, '\\u003c')}</script>
  <script>${SCRIPT}</script>
</body>
</html>`;
}
