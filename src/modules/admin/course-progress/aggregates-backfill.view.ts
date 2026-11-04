/**
 * One-off admin page to repair enrollment totals (time spent + progress).
 * Plain HTML/JS served by the API (no frontend build). The page itself holds
 * no data; every action goes through admin-only API endpoints, so access is
 * enforced by the session cookie + admin role on the server.
 */
export function getAggregatesBackfillHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Fix Enrollment Totals - Codekaro Admin</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #0b0b0f; color: #e4e4e7; line-height: 1.5; }
    main { max-width: 860px; margin: 0 auto; padding: 32px 20px 64px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    p.sub { color: #a1a1aa; margin: 0 0 24px; font-size: 14px; }
    .card { background: #131318; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .card h2 { font-size: 15px; margin: 0 0 12px; color: #fafafa; }
    label { display: block; font-size: 12px; color: #a1a1aa; margin: 12px 0 4px; }
    input, select { width: 100%; padding: 9px 10px; background: #09090b; color: #fafafa; border: 1px solid #3f3f46; border-radius: 8px; font-size: 14px; }
    input:focus, select:focus { outline: 2px solid #6366f1; border-color: #6366f1; }
    .row { display: flex; gap: 8px; align-items: flex-end; }
    .row > * { flex: 1; }
    .row > button { flex: 0 0 auto; }
    button { padding: 9px 14px; border-radius: 8px; border: 1px solid #3f3f46; background: #1f1f26; color: #fafafa; font-size: 14px; cursor: pointer; }
    button:hover:not(:disabled) { background: #2a2a33; }
    button:disabled { opacity: .45; cursor: not-allowed; }
    button.primary { background: #4f46e5; border-color: #4f46e5; }
    button.primary:hover:not(:disabled) { background: #6366f1; }
    button.danger { background: #be123c; border-color: #be123c; }
    button.danger:hover:not(:disabled) { background: #e11d48; }
    .actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
    .hidden { display: none !important; }
    .muted { color: #a1a1aa; font-size: 13px; }
    .msg { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; }
    .msg.err { background: #3b0d1a; border: 1px solid #7f1d3a; color: #fda4af; }
    .msg.ok { background: #0b2e1f; border: 1px solid #14532d; color: #86efac; }
    .msg.info { background: #172033; border: 1px solid #1e3a8a; color: #93c5fd; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 14px 0; }
    .stat { background: #09090b; border: 1px solid #27272a; border-radius: 10px; padding: 12px; }
    .stat b { display: block; font-size: 22px; }
    .stat span { font-size: 12px; color: #a1a1aa; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
    th, td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #27272a; }
    th { color: #a1a1aa; font-weight: 600; }
    td.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .tabs { display: flex; gap: 6px; margin-bottom: 8px; }
    .tabs button.active { background: #312e81; border-color: #4f46e5; }
    .who { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
    .scroll { overflow-x: auto; }
  </style>
</head>
<body>
<main>
  <h1>Fix enrollment totals</h1>
  <p class="sub">One-time repair: recalculates each enrollment's total time spent and progress from its per-video records. Preview first, then apply.</p>

  <!-- Login -->
  <section id="login-card" class="card hidden">
    <h2>Admin sign in</h2>
    <div class="tabs">
      <button id="tab-password" class="active" type="button">Password</button>
      <button id="tab-otp" type="button">Email code (OTP)</button>
    </div>
    <label for="email">Email</label>
    <input id="email" type="email" autocomplete="username" placeholder="admin@example.com">
    <div id="password-fields">
      <label for="password">Password</label>
      <input id="password" type="password" autocomplete="current-password">
    </div>
    <div id="otp-fields" class="hidden">
      <label for="otp">Code from email</label>
      <div class="row">
        <input id="otp" inputmode="numeric" autocomplete="one-time-code" placeholder="1234">
        <button id="send-otp" type="button">Send code</button>
      </div>
    </div>
    <div class="actions"><button id="login-btn" class="primary" type="button">Sign in</button></div>
    <div id="login-msg" class="msg hidden"></div>
  </section>

  <!-- Tool -->
  <section id="tool" class="hidden">
    <div class="card who">
      <div><span class="muted">Signed in as</span> <b id="who"></b></div>
      <button id="logout-btn" type="button">Sign out</button>
    </div>

    <div class="card">
      <h2>1. Choose scope</h2>
      <label for="batch-q">Search batch by name (leave empty to list recent batches)</label>
      <div class="row">
        <input id="batch-q" placeholder="e.g. Web Dev">
        <button id="batch-search" type="button">Search</button>
      </div>
      <label for="batch">Batch</label>
      <select id="batch"><option value="">All batches</option></select>
      <label for="enrollment">Single enrollment ID (optional - to try it on one student first)</label>
      <input id="enrollment" placeholder="enrollment UUID">

      <div class="actions">
        <button id="preview-btn" class="primary" type="button">Preview (no changes)</button>
        <button id="apply-btn" class="danger" type="button" disabled>Apply changes</button>
      </div>
      <p class="muted" id="scope-note"></p>
      <div id="tool-msg" class="msg hidden"></div>
    </div>

    <div id="result" class="card hidden">
      <h2 id="result-title">Result</h2>
      <div class="stats" id="stats"></div>
      <div id="diff-wrap" class="scroll hidden">
        <div class="muted">Largest differences (up to 25)</div>
        <table>
          <thead><tr><th>Enrollment</th><th>Time now (min)</th><th>Time after (min)</th><th>Progress now</th><th>Progress after</th></tr></thead>
          <tbody id="diff-body"></tbody>
        </table>
      </div>
    </div>
  </section>
</main>

<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var previewedScope = null; // scope key of the last successful preview with changes

  function show(el, on) { el.classList.toggle('hidden', !on); }
  function setMsg(el, text, kind) {
    el.textContent = text || '';
    el.className = 'msg ' + (kind || 'info') + (text ? '' : ' hidden');
  }
  async function api(path, opts) {
    opts = opts || {};
    var res = await fetch(path, {
      method: opts.method || 'GET',
      credentials: 'same-origin',
      headers: opts.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    var data = null;
    try { data = await res.json(); } catch (e) {}
    return { ok: res.ok, status: res.status, data: data };
  }
  function errText(r, fallback) {
    var d = r.data || {};
    return d.message || (d.error && d.error.message) || d.error || fallback + ' (HTTP ' + r.status + ')';
  }

  // ---- Session ----
  async function checkSession() {
    var r = await api('/v1/auth/session');
    var user = r.ok && r.data && r.data.user;
    if (user && user.role === 'admin') {
      $('who').textContent = (user.name ? user.name + ' - ' : '') + user.email;
      show($('login-card'), false);
      show($('tool'), true);
      searchBatches();
    } else if (user) {
      show($('tool'), false);
      show($('login-card'), true);
      setMsg($('login-msg'), 'Signed in as ' + user.email + ' but this account is not an admin. Sign in with an admin account.', 'err');
    } else {
      show($('tool'), false);
      show($('login-card'), true);
    }
  }

  // ---- Login ----
  var mode = 'password';
  function setMode(m) {
    mode = m;
    $('tab-password').classList.toggle('active', m === 'password');
    $('tab-otp').classList.toggle('active', m === 'otp');
    show($('password-fields'), m === 'password');
    show($('otp-fields'), m === 'otp');
    setMsg($('login-msg'), '');
  }
  $('tab-password').onclick = function () { setMode('password'); };
  $('tab-otp').onclick = function () { setMode('otp'); };

  $('send-otp').onclick = async function () {
    var email = $('email').value.trim();
    if (!email) return setMsg($('login-msg'), 'Enter your email first.', 'err');
    $('send-otp').disabled = true;
    var r = await api('/api/auth/email-otp/send-verification-otp', { method: 'POST', body: { email: email, type: 'sign-in' } });
    $('send-otp').disabled = false;
    setMsg($('login-msg'), r.ok ? 'Code sent to ' + email + '. Enter it above.' : errText(r, 'Could not send code'), r.ok ? 'ok' : 'err');
  };

  $('login-btn').onclick = async function () {
    var email = $('email').value.trim();
    if (!email) return setMsg($('login-msg'), 'Enter your email.', 'err');
    var r;
    $('login-btn').disabled = true;
    if (mode === 'password') {
      var pw = $('password').value;
      if (!pw) { $('login-btn').disabled = false; return setMsg($('login-msg'), 'Enter your password.', 'err'); }
      r = await api('/api/auth/sign-in/email', { method: 'POST', body: { email: email, password: pw } });
    } else {
      var otp = $('otp').value.trim();
      if (!otp) { $('login-btn').disabled = false; return setMsg($('login-msg'), 'Enter the code from your email.', 'err'); }
      r = await api('/api/auth/sign-in/email-otp', { method: 'POST', body: { email: email, otp: otp } });
    }
    $('login-btn').disabled = false;
    if (!r.ok) return setMsg($('login-msg'), errText(r, 'Sign in failed'), 'err');
    $('password').value = '';
    $('otp').value = '';
    setMsg($('login-msg'), '');
    checkSession();
  };

  $('logout-btn').onclick = async function () {
    await api('/api/auth/sign-out', { method: 'POST', body: {} });
    previewedScope = null;
    show($('result'), false);
    checkSession();
  };

  // ---- Batches ----
  async function searchBatches() {
    var q = $('batch-q').value.trim();
    var r = await api('/v1/admin/batches?limit=50&q=' + encodeURIComponent(q));
    var sel = $('batch');
    sel.innerHTML = '';
    var all = document.createElement('option');
    all.value = ''; all.textContent = 'All batches';
    sel.appendChild(all);
    if (!r.ok) return setMsg($('tool-msg'), errText(r, 'Could not load batches'), 'err');
    var list = (r.data && r.data.data && r.data.data.batches) || [];
    list.forEach(function (b) {
      var o = document.createElement('option');
      o.value = b.id; o.textContent = b.name || b.id;
      sel.appendChild(o);
    });
    setMsg($('tool-msg'), list.length ? '' : 'No batches found for that search.', 'info');
    resetPreview();
  }
  $('batch-search').onclick = searchBatches;
  $('batch-q').addEventListener('keydown', function (e) { if (e.key === 'Enter') searchBatches(); });

  // ---- Scope / preview / apply ----
  function scope() {
    return { batchId: $('batch').value || null, enrollmentId: $('enrollment').value.trim() || null };
  }
  function scopeKey() { var s = scope(); return (s.batchId || '') + '|' + (s.enrollmentId || ''); }
  function describeScope() {
    var s = scope();
    if (s.enrollmentId) return 'one enrollment';
    if (s.batchId) return 'every enrollment in "' + $('batch').selectedOptions[0].textContent + '"';
    return 'ALL batches';
  }
  function resetPreview() {
    previewedScope = null;
    $('apply-btn').disabled = true;
    $('scope-note').textContent = '';
  }
  ['batch', 'enrollment'].forEach(function (id) {
    $(id).addEventListener('change', resetPreview);
    $(id).addEventListener('input', resetPreview);
  });

  function minutes(sec) { return (sec / 60).toFixed(1); }

  function render(d, applied) {
    show($('result'), true);
    $('result-title').textContent = applied ? 'Applied' : 'Preview (nothing changed yet)';
    var stats = $('stats');
    stats.innerHTML = '';
    [
      ['Enrollments checked', d.totalEnrollments],
      [applied ? 'Updated' : 'Would be updated', applied ? d.updated : d.mismatched],
      ['Total was too high', d.timeWasHigher],
      ['Total was too low', d.timeWasLower]
    ].forEach(function (s) {
      var div = document.createElement('div'); div.className = 'stat';
      var b = document.createElement('b'); b.textContent = s[1];
      var sp = document.createElement('span'); sp.textContent = s[0];
      div.appendChild(b); div.appendChild(sp); stats.appendChild(div);
    });
    var body = $('diff-body');
    body.innerHTML = '';
    var rows = d.largestDifferences || [];
    show($('diff-wrap'), rows.length > 0);
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      [r.enrollmentId, minutes(r.currentTimeSpentSeconds), minutes(r.newTimeSpentSeconds), r.currentProgress + '%', r.newProgress + '%'].forEach(function (v, i) {
        var td = document.createElement('td'); if (i === 0) td.className = 'mono'; td.textContent = v; tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  async function run(dryRun) {
    var s = scope();
    var body = { dryRun: dryRun };
    if (s.batchId) body.batchId = s.batchId;
    if (s.enrollmentId) body.enrollmentId = s.enrollmentId;
    $('preview-btn').disabled = true; $('apply-btn').disabled = true;
    setMsg($('tool-msg'), dryRun ? 'Checking...' : 'Applying, please wait...', 'info');
    var r = await api('/v1/admin/course-progress/recalculate-aggregates', { method: 'POST', body: body });
    $('preview-btn').disabled = false;
    if (r.status === 401 || r.status === 403) {
      setMsg($('tool-msg'), 'Session expired or not an admin. Please sign in again.', 'err');
      return checkSession();
    }
    if (!r.ok) {
      setMsg($('tool-msg'), errText(r, 'Request failed'), 'err');
      $('apply-btn').disabled = !previewedScope;
      return;
    }
    var d = r.data.data;
    render(d, !dryRun);
    if (dryRun) {
      previewedScope = d.mismatched > 0 ? scopeKey() : null;
      $('apply-btn').disabled = !previewedScope;
      $('scope-note').textContent = d.mismatched > 0 ? 'Applying will update ' + d.mismatched + ' enrollment(s) in ' + describeScope() + '.' : '';
      setMsg($('tool-msg'), d.mismatched > 0 ? 'Preview ready. Review the numbers, then click Apply.' : 'Everything already matches. Nothing to fix for this scope.', d.mismatched > 0 ? 'info' : 'ok');
    } else {
      previewedScope = null;
      $('apply-btn').disabled = true;
      $('scope-note').textContent = '';
      setMsg($('tool-msg'), 'Done. Updated ' + d.updated + ' enrollment(s). Click Preview again to confirm that 0 are left.', 'ok');
    }
  }

  $('preview-btn').onclick = function () { run(true); };
  $('apply-btn').onclick = function () {
    if (previewedScope !== scopeKey()) { resetPreview(); return setMsg($('tool-msg'), 'Scope changed. Run Preview again first.', 'err'); }
    if (confirm('This will overwrite the stored total time and progress for ' + describeScope() + '. Continue?')) run(false);
  };

  checkSession();
})();
</script>
</body>
</html>`;
}
