/**
 * Basic admin page to run server commands and see their output (testing tool).
 * Plain HTML/JS served by the API (no frontend build). The page holds no data; every action goes
 * through admin-only API endpoints, so access is enforced by the session cookie + admin role.
 */
export function getAdminTerminalHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin Terminal - Codekaro</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #0b0b0f; color: #e4e4e7; line-height: 1.5; }
    main { max-width: 980px; margin: 0 auto; padding: 32px 20px 64px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    p.sub { color: #a1a1aa; margin: 0 0 20px; font-size: 14px; }
    .card { background: #131318; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .card h2 { font-size: 15px; margin: 0 0 12px; color: #fafafa; }
    label { display: block; font-size: 12px; color: #a1a1aa; margin: 12px 0 4px; }
    input, select, textarea { width: 100%; padding: 9px 10px; background: #09090b; color: #fafafa; border: 1px solid #3f3f46; border-radius: 8px; font-size: 14px; font-family: inherit; }
    textarea { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; resize: vertical; min-height: 64px; }
    input:focus, select:focus, textarea:focus { outline: 2px solid #6366f1; border-color: #6366f1; }
    .row { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }
    .row > .grow { flex: 1; min-width: 200px; }
    button { padding: 9px 14px; border-radius: 8px; border: 1px solid #3f3f46; background: #1f1f26; color: #fafafa; font-size: 14px; cursor: pointer; }
    button:hover:not(:disabled) { background: #2a2a33; }
    button:disabled { opacity: .45; cursor: not-allowed; }
    button.primary { background: #4f46e5; border-color: #4f46e5; }
    button.primary:hover:not(:disabled) { background: #6366f1; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chips button { font-size: 13px; padding: 7px 11px; }
    .hidden { display: none !important; }
    .muted { color: #a1a1aa; font-size: 13px; }
    .msg { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; }
    .msg.err { background: #3b0d1a; border: 1px solid #7f1d3a; color: #fda4af; }
    .msg.ok { background: #0b2e1f; border: 1px solid #14532d; color: #86efac; }
    .msg.info { background: #172033; border: 1px solid #1e3a8a; color: #93c5fd; }
    .warn { background: #33250a; border: 1px solid #78510f; color: #fcd34d; padding: 10px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; }
    .tabs { display: flex; gap: 6px; margin-bottom: 8px; }
    .tabs button.active { background: #312e81; border-color: #4f46e5; }
    .who { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
    .actions { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
    .out-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; flex-wrap: wrap; }
    pre#out { margin: 0; padding: 14px; background: #050507; border: 1px solid #27272a; border-radius: 10px; min-height: 220px; max-height: 60vh; overflow: auto; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12.5px; white-space: pre-wrap; word-break: break-word; }
    .cmdline { color: #a5b4fc; }
    .stderr { color: #fda4af; }
    .meta { color: #a1a1aa; }
    .good { color: #86efac; }
    .bad { color: #fda4af; }
  </style>
</head>
<body>
<main>
  <h1>Admin terminal</h1>
  <p class="sub">Run server commands and see the output here. For testing. Every run is logged with your account.</p>

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
        <div class="grow"><input id="otp" inputmode="numeric" autocomplete="one-time-code" placeholder="1234"></div>
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
      <h2>Quick commands</h2>
      <div id="chips" class="chips"></div>
    </div>

    <div id="freeform-card" class="card hidden">
      <h2>Custom command</h2>
      <div class="warn">Free-form mode is ON (ADMIN_SHELL_ENABLED=true). Anything you type runs on the server as the app user. Turn it off when you are done testing.</div>
      <label for="cmd">Command (runs with /bin/sh -c in the app directory)</label>
      <textarea id="cmd" spellcheck="false" placeholder="e.g. pnpm -v   or   ls -la   or   tail -n 50 logs/app-2026-11-05.log"></textarea>
      <div class="row">
        <div>
          <label for="timeout">Timeout</label>
          <select id="timeout">
            <option value="10">10 s</option>
            <option value="30" selected>30 s</option>
            <option value="60">60 s</option>
            <option value="120">120 s</option>
          </select>
        </div>
        <button id="run-btn" class="primary" type="button">Run (Ctrl+Enter)</button>
      </div>
    </div>
    <div id="freeform-off" class="card hidden">
      <div class="muted">Custom commands are disabled on this server. Only the quick commands above are available. To enable custom commands for testing, set <code>ADMIN_SHELL_ENABLED=true</code> and restart the app.</div>
    </div>

    <div class="card">
      <div class="out-head">
        <h2 style="margin:0">Output</h2>
        <button id="clear-btn" type="button">Clear</button>
      </div>
      <pre id="out">Nothing run yet.</pre>
      <div id="tool-msg" class="msg hidden"></div>
    </div>
  </section>
</main>

<script>
(function () {
  var $ = function (id) { return document.getElementById(id); };
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
      loadCommands();
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
    checkSession();
  };

  // ---- Commands ----
  var busy = false;
  function setBusy(on) {
    busy = on;
    var buttons = document.querySelectorAll('#chips button, #run-btn');
    for (var i = 0; i < buttons.length; i++) buttons[i].disabled = on;
  }

  async function loadCommands() {
    var r = await api('/v1/admin/terminal/commands');
    if (r.status === 401 || r.status === 403) return checkSession();
    if (!r.ok) return setMsg($('tool-msg'), errText(r, 'Could not load commands'), 'err');
    var d = r.data.data;
    var chips = $('chips');
    chips.innerHTML = '';
    d.commands.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c.label;
      b.title = c.description;
      b.onclick = function () { run({ commandId: c.id }); };
      chips.appendChild(b);
    });
    show($('freeform-card'), d.freeFormEnabled);
    show($('freeform-off'), !d.freeFormEnabled);
  }

  function append(text, cls) {
    var span = document.createElement('span');
    if (cls) span.className = cls;
    span.textContent = text;
    $('out').appendChild(span);
  }

  async function run(body) {
    if (busy) return;
    setBusy(true);
    setMsg($('tool-msg'), 'Running...', 'info');
    var started = !$('out').dataset.used;
    if (started) { $('out').textContent = ''; $('out').dataset.used = '1'; }
    var r = await api('/v1/admin/terminal/run', { method: 'POST', body: body });
    setBusy(false);
    if (r.status === 401 || r.status === 403 && !(r.data && /disabled/.test(r.data.message || ''))) {
      setMsg($('tool-msg'), 'Session expired or not an admin. Please sign in again.', 'err');
      return checkSession();
    }
    if (!r.ok) {
      append('\\n', '');
      append('error: ' + errText(r, 'Request failed') + '\\n', 'bad');
      return setMsg($('tool-msg'), errText(r, 'Request failed'), 'err');
    }
    var d = r.data.data;
    append('$ ' + d.command + '\\n', 'cmdline');
    if (d.stdout) append(d.stdout.endsWith('\\n') ? d.stdout : d.stdout + '\\n', '');
    if (d.stderr) append(d.stderr.endsWith('\\n') ? d.stderr : d.stderr + '\\n', 'stderr');
    var ok = d.exitCode === 0 && !d.timedOut;
    var meta = '[exit ' + d.exitCode + (d.signal ? ', signal ' + d.signal : '') + ', ' + d.durationMs + ' ms' +
      (d.timedOut ? ', TIMED OUT' : '') + (d.truncated ? ', output truncated at 200 KB' : '') + ']\\n\\n';
    append(meta, ok ? 'good' : 'bad');
    $('out').scrollTop = $('out').scrollHeight;
    setMsg($('tool-msg'), '');
  }

  $('run-btn').onclick = function () {
    var command = $('cmd').value.trim();
    if (!command) return setMsg($('tool-msg'), 'Type a command first.', 'err');
    run({ command: command, timeoutSeconds: parseInt($('timeout').value, 10) });
  };
  $('cmd').addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); $('run-btn').click(); }
  });
  $('clear-btn').onclick = function () {
    $('out').textContent = 'Nothing run yet.';
    delete $('out').dataset.used;
    setMsg($('tool-msg'), '');
  };

  checkSession();
})();
</script>
</body>
</html>`;
}
