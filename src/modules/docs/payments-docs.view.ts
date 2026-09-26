export function getPaymentsDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en" class="h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Razorpay Payment Integration Guide - Codekaro</title>
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

  <!-- Header -->
  <header class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs / razorpay payments</span>
      </div>
      <div class="flex items-center space-x-3">
        <a href="/docs/implement" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">Integration Guide</a>
        <a href="/docs/email-preview" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">Email Sandbox</a>
        <a href="/docs" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">← API Reference</a>
      </div>
    </div>
  </header>

  <!-- Main Content Layout -->
  <main class="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
    <div class="space-y-12">
      <!-- Title Section -->
      <section class="space-y-4">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-medium border border-indigo-500/20">
          Razorpay Integration & Verification Specification
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Razorpay Payment Integration Guide</h1>
        <p class="text-zinc-400 text-base max-w-3xl">
          Complete architectural guide for frontend and backend engineers to implement Razorpay checkout order generation, HMAC-SHA256 signature verification, guest auto-registration, session cookies, renewals, pending payments, and server-to-server webhooks.
        </p>
      </section>

      <!-- Quick Index Navigation -->
      <section class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <a href="#env-setup" class="bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 p-3 rounded-lg text-zinc-300 hover:text-white transition text-center">
          ⚡ 1. Environment Setup
        </a>
        <a href="#payment-flow" class="bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 p-3 rounded-lg text-zinc-300 hover:text-white transition text-center">
          🔄 2. Integration Flow
        </a>
        <a href="#api-reference" class="bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 p-3 rounded-lg text-zinc-300 hover:text-white transition text-center">
          📡 3. API Endpoints
        </a>
        <a href="#code-examples" class="bg-zinc-900/80 border border-zinc-800 hover:border-indigo-500/50 p-3 rounded-lg text-zinc-300 hover:text-white transition text-center">
          💻 4. Code Examples
        </a>
      </section>

      <!-- Section 1: Environment Setup -->
      <section id="env-setup" class="border border-zinc-900 bg-zinc-900/20 rounded-xl p-6 space-y-4 scroll-mt-24">
        <h2 class="text-lg font-semibold text-white font-mono flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-indigo-500"></span> 1. Environment Configuration
        </h2>
        <p class="text-zinc-400 text-sm">
          Ensure the following environment variables are set in your backend <code>.env</code> configuration file before processing transactions:
        </p>

        <pre class="bg-zinc-950 border border-zinc-800 text-zinc-300 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code># Razorpay API Credentials
RAZORPAY_KEY_ID="rzp_test_..."          # Razorpay Key ID (public key sent to checkout SDK)
RAZORPAY_KEY_SECRET="your_key_secret"    # Razorpay Key Secret (used for HMAC signature verification)
RAZORPAY_WEBHOOK_SECRET="whsec_..."      # Webhook Secret configured in Razorpay Dashboard

# Application Configuration
FRONTEND_URL="https://codingkampus.com"  # Base URL used in automated payment confirmation emails</code></pre>
      </section>

      <!-- Section 2: Integration Flow Architecture -->
      <section id="payment-flow" class="border border-zinc-900 bg-zinc-900/20 rounded-xl p-6 space-y-6 scroll-mt-24">
        <h2 class="text-lg font-semibold text-white font-mono flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> 2. Integration Sequence Architecture
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-xs">
          <div class="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">1. CREATE ORDER</div>
            <p class="text-zinc-400 text-[11px]">Frontend calls <code>/v1/payments/razorpay/create-order</code>. Backend creates pending enrollment & Razorpay order ID.</p>
          </div>
          <div class="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">2. GATEWAY CHECKOUT</div>
            <p class="text-zinc-400 text-[11px]">Launch <code>window.Razorpay</code> modal. Customer completes UPI/Card/Netbanking transaction.</p>
          </div>
          <div class="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">3. VERIFY SIGNATURE</div>
            <p class="text-zinc-400 text-[11px]">Frontend sends signatures & <code>enrollmentId</code> to <code>/v1/payments/razorpay/verify</code> for O(1) DB activation.</p>
          </div>
          <div class="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">4. WEBHOOK FALLBACK</div>
            <p class="text-zinc-400 text-[11px]">Razorpay sends <code>payment.captured</code> webhook to <code>/v1/payments/razorpay/webhook</code> for guaranteed fulfillment.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: API Endpoint Specification -->
      <section id="api-reference" class="space-y-8 scroll-mt-24">
        <h2 class="text-2xl font-bold text-white font-mono border-b border-zinc-900 pb-3">3. API Endpoints Specification</h2>

        <!-- Endpoint 1: Create Order -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white font-mono">3.1 Create Payment Order</h3>
            <span class="text-xs font-mono text-zinc-500">Optional Auth (Guest & Logged-In)</span>
          </div>
          <p class="text-zinc-400 text-sm">
            Initializes a new transaction. If the user is logged in (Authorization header or cookie present), the system attaches the enrollment to their account. If unauthenticated, pass guest <code>email</code> and <code>phone</code> — the system automatically creates a student account if one doesn't exist.
          </p>
          
          <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20">POST</span>
                <span class="text-zinc-200">/v1/payments/razorpay/create-order</span>
              </div>
              <span class="text-zinc-400">Accepts JSON Body OR URL Query Params</span>
            </div>
            
            <div class="p-4 space-y-4">
              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Request Payload Schema:</div>
                <pre class="bg-zinc-950 text-zinc-300 p-3.5 rounded-md text-xs font-mono overflow-x-auto border border-zinc-900"><code>{
  "paymentType": "enrollment" | "pending_payment" | "renew", // Optional (default: "enrollment")
  "batchId": string,           // Required IF paymentType is "enrollment"
  "enrollmentId": string,      // Required IF paymentType is "pending_payment" or "renew"
  "email": string,             // Required for guest checkout (unauthenticated)
  "phone": string,             // Required for guest checkout (10-15 digits)
  "name": string               // Optional guest student name
}</code></pre>
              </div>

              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Response Success Example (HTTP 201):</div>
                <pre class="bg-zinc-950 text-zinc-300 p-3.5 rounded-md text-xs font-mono overflow-x-auto border border-zinc-900"><code>{
  "status": "success",
  "data": {
    "keyId": "rzp_test_...",
    "orderId": "order_O2GY8x...",
    "amount": 499900,           // Amount in paise (₹4,999.00)
    "currency": "INR",
    "enrollmentId": "uuid-string"
  }
}</code></pre>
              </div>
            </div>
          </div>

          <div class="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 space-y-2">
            <div class="font-bold text-indigo-400">💡 Payment Types Explained:</div>
            <ul class="list-disc pl-5 space-y-1 text-zinc-400">
              <li><strong class="text-white">enrollment:</strong> Standard batch purchase. Requires <code>batchId</code>. Amount = <code>batch.price</code>.</li>
              <li><strong class="text-white">pending_payment:</strong> Resume unpaid balance on existing enrollment. Requires <code>enrollmentId</code>. Amount = <code>totalAmount - amountPaid</code>.</li>
              <li><strong class="text-white">renew:</strong> Extend access by 1 year. Requires <code>enrollmentId</code>. Amount = <code>batch.renewalFee</code> (or falls back to <code>batch.price</code> if blank).</li>
            </ul>
          </div>
        </div>

        <!-- Endpoint 2: Verify Payment -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white font-mono">3.2 Verify Payment & Activate Enrollment</h3>
            <span class="text-xs font-mono text-emerald-400">Public Verification Endpoint</span>
          </div>
          <p class="text-zinc-400 text-sm">
            Validates Razorpay HMAC signature (<code>sha256(order_id + '|' + payment_id, secret)</code>). Executes O(1) database transaction to mark payment captured, calculate total paid, auto-generate HTTP-only session cookie (30 days), and queue asynchronous receipt/access emails.
          </p>

          <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20">POST</span>
                <span class="text-zinc-200">/v1/payments/razorpay/verify</span>
              </div>
              <span class="text-zinc-400">JSON Body Required</span>
            </div>

            <div class="p-4 space-y-4">
              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Request Payload Schema:</div>
                <pre class="bg-zinc-950 text-zinc-300 p-3.5 rounded-md text-xs font-mono overflow-x-auto border border-zinc-900"><code>{
  "enrollmentId": string,         // Enrollment ID returned from create-order (O(1) indexing)
  "razorpay_payment_id": string,  // Gateway Payment ID (pay_...)
  "razorpay_order_id": string,    // Gateway Order ID (order_...)
  "razorpay_signature": string   // HMAC SHA-256 Signature string
}</code></pre>
              </div>

              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Response Success Example (HTTP 200 + Sets Session Cookie):</div>
                <pre class="bg-zinc-950 text-zinc-300 p-3.5 rounded-md text-xs font-mono overflow-x-auto border border-zinc-900"><code>{
  "status": "success",
  "message": "Payment successfully verified",
  "data": {
    "enrollmentId": "uuid-string",
    "paymentId": "pay_O2GZ...",
    "orderId": "order_O2GY...",
    "batchName": "Fullstack Web Development Cohort",
    "batchTopic": "Hono & Next.js",
    "paymentType": "enrollment",
    "token": "eyJhbGciOi...",      // JWT Session token for frontend localStorage
    "user": {
      "id": "uuid-string",
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student",
      "status": "active"
    }
  }
}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Endpoint 3: Webhook Handler -->
        <div class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white font-mono">3.3 Razorpay Webhook Callback</h3>
            <span class="text-xs font-mono text-amber-400">Server-to-Server Endpoint</span>
          </div>
          <p class="text-zinc-400 text-sm">
            Processes asynchronous payment updates directly from Razorpay servers. Ensures guaranteed payment fulfillment even if the user closes their browser window before frontend verification completes.
          </p>

          <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold border border-blue-500/20">POST</span>
                <span class="text-zinc-200">/v1/payments/razorpay/webhook</span>
              </div>
              <span class="text-zinc-400">Headers: X-Razorpay-Signature</span>
            </div>

            <div class="p-4 space-y-4">
              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Webhook Setup Instructions:</div>
                <ol class="list-decimal pl-5 text-xs text-zinc-300 space-y-1.5 font-mono">
                  <li>Log in to your <strong>Razorpay Dashboard &rarr; Settings &rarr; Webhooks</strong>.</li>
                  <li>Add Webhook URL: <code class="text-indigo-400">https://api.codekaro.in/v1/payments/razorpay/webhook</code></li>
                  <li>Set Secret to match your <code class="text-indigo-400">RAZORPAY_WEBHOOK_SECRET</code> environment variable.</li>
                  <li>Select Active Events: <code class="text-emerald-400">payment.captured</code>.</li>
                </ol>
              </div>

              <div>
                <div class="text-zinc-400 text-xs font-mono mb-2">Signature Verification Logic:</div>
                <pre class="bg-zinc-950 text-zinc-300 p-3.5 rounded-md text-xs font-mono overflow-x-auto border border-zinc-900"><code>const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
  .update(rawBodyText)
  .digest('hex');

if (expectedSignature === header['x-razorpay-signature']) {
  // Process payment.captured event
}</code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Public Pricing Endpoints -->
        <div class="space-y-4 pt-4">
          <h3 class="text-xl font-bold text-white font-mono">3.4 Public Batch Details & Pricing APIs</h3>
          <p class="text-zinc-400 text-sm">
            Fetch batch details, pricing, and title prior to checkout without authentication headers:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
              <div class="flex items-center gap-2 text-xs font-mono">
                <span class="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">GET</span>
                <span class="text-zinc-200">/v1/batches/:id/public</span>
              </div>
              <p class="text-zinc-400 text-xs">Fetch batch name & price by batch ID.</p>
            </div>

            <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-2">
              <div class="flex items-center gap-2 text-xs font-mono">
                <span class="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-bold">GET</span>
                <span class="text-zinc-200">/v1/batches/slug/:slug/public</span>
              </div>
              <p class="text-zinc-400 text-xs">Fetch batch details by URL slug string.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 4: Frontend Code Examples -->
      <section id="code-examples" class="space-y-6 scroll-mt-24">
        <h2 class="text-2xl font-bold text-white font-mono border-b border-zinc-900 pb-3">4. Integration Code Implementation</h2>

        <!-- Vanilla JS Example -->
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-white font-mono">4.1 Vanilla JavaScript Integration</h3>
          <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code>&lt;!-- 1. Include Razorpay SDK --&gt;
&lt;script src="https://checkout.razorpay.com/v1/checkout.js"&gt;&lt;/script&gt;

&lt;script&gt;
async function startCheckout(batchId, guestEmail, guestPhone) {
  try {
    // 2. Call Backend Order Creation Endpoint
    const orderRes = await fetch('/v1/payments/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentType: 'enrollment',
        batchId: String(batchId),
        email: guestEmail,
        phone: guestPhone
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) throw new Error(orderData.message);

    const { keyId, orderId, amount, currency, enrollmentId } = orderData.data;

    // 3. Configure Razorpay SDK Options
    const options = {
      key: keyId,
      amount: amount,
      currency: currency,
      name: 'Codekaro',
      description: 'Course Access Enrollment',
      order_id: orderId,
      handler: async function (response) {
        // 4. Send Credentials for Backend Verification
        const verifyRes = await fetch('/v1/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollmentId: enrollmentId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          // Store token & auto-login
          if (verifyData.data.token) {
            localStorage.setItem('jwt_token', verifyData.data.token);
            localStorage.setItem('user_profile', JSON.stringify(verifyData.data.user));
          }
          window.location.href = '/thank-you?batch=' + encodeURIComponent(verifyData.data.batchName);
        } else {
          alert('Payment Verification Failed: ' + verifyData.message);
        }
      },
      prefill: { email: guestEmail, contact: guestPhone },
      theme: { color: '#4f46e5' }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      alert('Payment Failed: ' + resp.error.description);
    });
    rzp.open();
  } catch (err) {
    alert('Checkout Error: ' + err.message);
  }
}
&lt;/script&gt;</code></pre>
        </div>

        <!-- React / Next.js Hook Example -->
        <div class="space-y-3 pt-4">
          <h3 class="text-sm font-bold text-white font-mono">4.2 React / Next.js Integration Hook</h3>
          <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code>import { useState } from 'react';

export function useRazorpayCheckout() {
  const [loading, setLoading] = useState(false);

  const triggerCheckout = async ({ batchId, email, phone, name }) => {
    setLoading(true);
    try {
      const res = await fetch('/v1/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentType: 'enrollment', batchId, email, phone, name })
      });

      const { data } = await res.json();

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Codekaro',
        order_id: data.orderId,
        handler: async (response) => {
          const verify = await fetch('/v1/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              enrollmentId: data.enrollmentId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          const result = await verify.json();
          if (verify.ok) {
            window.location.href = '/dashboard?enrolled=' + result.data.enrollmentId;
          }
        },
        prefill: { email, contact: phone, name }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout failed', err);
    } finally {
      setLoading(false);
    }
  };

  return { triggerCheckout, loading };
}</code></pre>
        </div>

        <!-- cURL Testing Commands -->
        <div class="space-y-3 pt-4">
          <h3 class="text-sm font-bold text-white font-mono">4.3 cURL Command Line Testing</h3>
          
          <div class="space-y-2">
            <div class="text-xs font-mono text-zinc-400">1. Create Order:</div>
            <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>curl -X POST https://api.codekaro.in/v1/payments/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"paymentType":"enrollment","batchId":"4","email":"test@example.com","phone":"9876543210"}'</code></pre>
          </div>

          <div class="space-y-2">
            <div class="text-xs font-mono text-zinc-400">2. Verify Payment Signature:</div>
            <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>curl -X POST https://api.codekaro.in/v1/payments/razorpay/verify \
  -H "Content-Type: application/json" \
  -d '{"enrollmentId":"uuid-string","razorpay_payment_id":"pay_123","razorpay_order_id":"order_123","razorpay_signature":"sig_abc"}'</code></pre>
          </div>
        </div>
      </section>

      <!-- Section 5: Troubleshooting & Status Codes -->
      <section class="border border-zinc-900 bg-zinc-900/10 rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-semibold text-white font-mono">5. Error Reference & Status Codes</h2>
        <table class="w-full text-xs font-mono border-collapse border border-zinc-800 text-left">
          <thead>
            <tr class="bg-zinc-900 text-zinc-300 border-b border-zinc-800">
              <th class="p-2 border-r border-zinc-800">HTTP Status</th>
              <th class="p-2 border-r border-zinc-800">Error Message</th>
              <th class="p-2">Cause & Resolution</th>
            </tr>
          </thead>
          <tbody class="text-zinc-400">
            <tr class="border-b border-zinc-800">
              <td class="p-2 border-r border-zinc-800 text-amber-400 font-bold">400</td>
              <td class="p-2 border-r border-zinc-800">Email and phone are required for guest checkout</td>
              <td class="p-2">Unauthenticated request missing guest <code>email</code> or <code>phone</code> fields.</td>
            </tr>
            <tr class="border-b border-zinc-800">
              <td class="p-2 border-r border-zinc-800 text-amber-400 font-bold">400</td>
              <td class="p-2 border-r border-zinc-800">batchId is required when paymentType is enrollment</td>
              <td class="p-2">Missing <code>batchId</code> parameter during enrollment creation.</td>
            </tr>
            <tr class="border-b border-zinc-800">
              <td class="p-2 border-r border-zinc-800 text-amber-400 font-bold">400</td>
              <td class="p-2 border-r border-zinc-800">Invalid payment signature</td>
              <td class="p-2">HMAC signature calculation failed. Verify <code>RAZORPAY_KEY_SECRET</code>.</td>
            </tr>
            <tr class="border-b border-zinc-800">
              <td class="p-2 border-r border-zinc-800 text-red-400 font-bold">500</td>
              <td class="p-2 border-r border-zinc-800">Razorpay API keys are not configured</td>
              <td class="p-2">Missing <code>RAZORPAY_KEY_ID</code> or <code>RAZORPAY_KEY_SECRET</code> in <code>.env</code> file.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developers Reference Manual • Razorpay Payment Specification • 2026
  </footer>
</body>
</html>`;
}

