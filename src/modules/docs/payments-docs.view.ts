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

  <!-- Header Header -->
  <header class="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-2.5">
        <div class="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center font-semibold text-zinc-50 text-xs tracking-tight shadow-md shadow-indigo-600/20">CK</div>
        <span class="text-zinc-50 font-normal tracking-wide text-sm font-mono">dev docs / payments</span>
      </div>
      <div>
        <a href="/docs" class="text-xs text-zinc-400 hover:text-zinc-50 transition border border-zinc-800 px-3 py-1.5 rounded-lg bg-zinc-900 font-mono">← API Docs</a>
      </div>
    </div>
  </header>

  <!-- Main Grid Layout -->
  <main class="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
    <div class="space-y-12">
      <!-- Title Section -->
      <section class="space-y-4">
        <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-mono font-medium">
          Frontend Integration Guide
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">Razorpay Checkout Integration</h1>
        <p class="text-zinc-400 text-base max-w-2xl">
          Complete guide for frontend engineers to implement the Razorpay checkout, verification, guest checkout flows, pending payments, and renewal logic.
        </p>
      </section>

      <!-- Flowchart -->
      <section class="border border-zinc-900 bg-zinc-900/20 rounded-xl p-6 space-y-6">
        <h2 class="text-lg font-semibold text-white font-mono flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Integration Flow
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-xs">
          <div class="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">1. CREATE ORDER</div>
            <p class="text-zinc-500 text-[10px]">Frontend sends request (optional JWT or guest email/phone) to get order details.</p>
          </div>
          <div class="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">2. OPEN CHECKOUT</div>
            <p class="text-zinc-500 text-[10px]">Initialize Razorpay Checkout SDK. User interacts and completes payment on gateway UI.</p>
          </div>
          <div class="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div class="text-indigo-400 font-bold">3. VERIFY PAYMENT</div>
            <p class="text-zinc-500 text-[10px]">Frontend sends signatures and enrollment ID to backend for O(1) verification & activation.</p>
          </div>
        </div>
      </section>

      <!-- Step 1: Create Order -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-white font-mono">1. Create Payment Order</h2>
        <p class="text-zinc-400 text-sm">
          Call the backend to initialize the transaction. Depending on the payment type, you must pass the appropriate payload. If the user is logged in, pass the Bearer JWT token; for guest users, pass <code>email</code> and <code>phone</code>.
        </p>
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">POST</span>
              <span class="text-zinc-300">/v1/payments/razorpay/create-order</span>
            </div>
            <span class="text-zinc-500">JSON Body</span>
          </div>
          <div class="p-4">
            <div class="text-zinc-400 text-xs font-mono mb-2">Request Payload Schema:</div>
            <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>{
  "paymentType": "enrollment" | "pending_payment" | "renew", // Optional (defaults to "enrollment")
  "batchId": number,           // Required ONLY if paymentType is "enrollment"
  "enrollmentId": number,      // Required ONLY if paymentType is "pending_payment" or "renew"
  "email": string,             // Required for guest checkout (no auth header)
  "phone": string,             // Required for guest checkout (no auth header)
  "name": string               // Optional guest name
}</code></pre>
          </div>
        </div>

        <!-- Query Parameters Option -->
        <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden mt-4">
          <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">POST</span>
              <span class="text-zinc-300">/v1/payments/razorpay/create-order</span>
            </div>
            <span class="text-zinc-500">Query Parameters</span>
          </div>
          <div class="p-4">
            <div class="text-zinc-400 text-xs font-mono mb-2">Request Query Parameters Schema:</div>
            <ul class="list-disc pl-5 text-xs text-zinc-400 font-mono space-y-1 mb-4">
              <li><code>paymentType</code>: "enrollment" | "pending_payment" | "renew" (Optional, defaults to <code>"enrollment"</code>)</li>
              <li><code>batchId</code>: number (Required if paymentType is "enrollment")</li>
              <li><code>enrollmentId</code>: number (Required if paymentType is "pending_payment" or "renew")</li>
              <li><code>email</code>: string (Required for guest checkout)</li>
              <li><code>phone</code>: string (Required for guest checkout)</li>
              <li><code>name</code>: string (Optional guest name)</li>
            </ul>
            <div class="text-zinc-400 text-xs font-mono mb-1">Example Request URL:</div>
            <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>/v1/payments/razorpay/create-order?paymentType=enrollment&batchId=4&email=guest@example.com&phone=9999999999&name=John</code></pre>
          </div>
        </div>

        <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-xs text-amber-300 space-y-1">
          <span class="font-bold">⚠️ Guest User & Parameter Options:</span>
          <p>
            When a guest user triggers order creation, the backend automatically validates if their email is in the DB. If not, it registers a user account under their email and creates a pending enrollment. Keep the returned <code>enrollmentId</code> for the verification phase.
          </p>
          <p class="mt-1">
            💡 <strong class="text-white">Frontend Tip:</strong> You can pass the parameters (<code>batchId</code>, <code>email</code>, <code>phone</code>, <code>name</code>, etc.) either as a JSON request body OR directly as URL query parameters (e.g., <code>/v1/payments/razorpay/create-order?batchId=4&email=guest@example.com&phone=9999999999&name=John</code>).
          </p>
        </div>
      </section>

      <!-- Step 2: Open Checkout SDK -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-white font-mono">2. Launch Razorpay Checkout</h2>
        <p class="text-zinc-400 text-sm">
          Load the Razorpay Checkout script dynamically or include it in your page:
        </p>
        <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code>&lt;script src="https://checkout.razorpay.com/v1/checkout.js"&gt;&lt;/script&gt;</code></pre>
        
        <p class="text-zinc-400 text-sm">
          Initialize checkout options with the exact response returned from the <code>create-order</code> endpoint:
        </p>

        <pre class="bg-zinc-900 border border-zinc-800 text-zinc-300 p-4 rounded-lg text-xs font-mono overflow-x-auto"><code>// 1. Call API to get order details
const orderRes = await fetch('/v1/payments/razorpay/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentType: 'enrollment',
    batchId: 4,
    email: 'guest@example.com',
    phone: '9999999999'
  })
});
const { data } = await orderRes.json();
// data = { keyId, orderId, amount, currency, enrollmentId }

// 2. Configure checkout options
const options = {
  key: data.keyId,
  amount: data.amount, // in paise
  currency: data.currency,
  name: 'Codekaro',
  description: 'Course Access Enrollment',
  order_id: data.orderId,
  handler: async function (response) {
    // 3. Call backend verification endpoint upon successful gateway payment
    const verifyRes = await fetch('/v1/payments/razorpay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollmentId: data.enrollmentId, // MUST PASS for O(1) lookup speed
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      })
    });
    
    const verifyData = await verifyRes.json();
    if (verifyRes.ok) {
      // 4. Auto-login student user if token is returned
      if (verifyData.data.token) {
        localStorage.setItem('jwt_token', verifyData.data.token);
        localStorage.setItem('user_profile', JSON.stringify(verifyData.data.user));
      }
      
      // 5. Redirect to custom thank you page with batch details
      const batchName = encodeURIComponent(verifyData.data.batchName || '');
      const batchTopic = encodeURIComponent(verifyData.data.batchTopic || '');
      window.location.href = `/thank-you?batchName=${batchName}&topic=${batchTopic}`;
    } else {
      alert('Verification Failed: ' + verifyData.message);
    }
  },
  prefill: {
    email: 'guest@example.com',
    contact: '9999999999'
  },
  theme: {
    color: '#4f46e5' // Indigo accent color
  }
};

const rzp = new window.Razorpay(options);
rzp.open();</code></pre>
      </section>

      <!-- Step 3: Verify Payment -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-white font-mono">3. Signature Verification</h2>
        <p class="text-zinc-400 text-sm">
          Once checkout returns credentials, send them immediately to the verify endpoint. The parameter <code>enrollmentId</code> is required to ensure database operations run instantly (**O(1)** query lookup).
        </p>

        <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">POST</span>
              <span class="text-zinc-300">/v1/payments/razorpay/verify</span>
            </div>
            <span class="text-zinc-500">JSON Body</span>
          </div>
          <div class="p-4">
            <div class="text-zinc-400 text-xs font-mono mb-2">Request Payload Schema:</div>
            <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>{
  "enrollmentId": number,
  "razorpay_payment_id": string,
  "razorpay_order_id": string,
  "razorpay_signature": string
}</code></pre>
          </div>
          <div class="p-4 border-t border-zinc-800">
            <div class="text-zinc-400 text-xs font-mono mb-2">Response Payload Example:</div>
            <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>{
  "status": "success",
  "message": "Payment successfully verified",
  "data": {
    "enrollmentId": 248,
    "paymentId": "pay_O2GZ...",
    "orderId": "order_O2GY...",
    "batchName": "Backend Engineering Cohort",
    "batchTopic": "Node.js & Hono",
    "paymentType": "enrollment", // "enrollment" | "pending_payment" | "renew"
    "token": "eyJhbGciOi...", // JWT Session token (Frontend should store this to auto-login guest user)
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
      </section>

      <!-- Public Batch Details Endpoint -->
      <section class="space-y-4">
        <h2 class="text-xl font-bold text-white font-mono">Public Batch Details & Pricing</h2>
        <p class="text-zinc-400 text-sm">
          To display the correct course title, topic, and price immediately on the checkout page before the guest enters their details, you can query the public batch details endpoints. These do not require any Authorization header.
        </p>

        <div class="space-y-4">
          <!-- Get by ID -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold">GET</span>
                <span class="text-zinc-300">/v1/batches/:id/public</span>
              </div>
              <span class="text-zinc-500">Public Route</span>
            </div>
            <div class="p-4 space-y-2">
              <div class="text-zinc-400 text-xs font-mono">Response Payload Example:</div>
              <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Backend Engineering Hono Cohort",
    "price": 4999
  }
}</code></pre>
            </div>
          </div>

          <!-- Get by Slug -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div class="bg-zinc-950 border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div class="flex items-center gap-2">
                <span class="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-bold">GET</span>
                <span class="text-zinc-300">/v1/batches/slug/:slug/public</span>
              </div>
              <span class="text-zinc-500">Public Route</span>
            </div>
            <div class="p-4 space-y-2">
              <div class="text-zinc-400 text-xs font-mono">Response Payload Example:</div>
              <pre class="bg-zinc-950 text-zinc-300 p-3 rounded text-xs font-mono overflow-x-auto"><code>{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Backend Engineering Hono Cohort",
    "price": 4999
  }
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Advanced Features -->
      <section class="space-y-6">
        <h2 class="text-xl font-bold text-white font-mono">Advanced Payment Actions</h2>
        
        <div class="space-y-4">
          <!-- Pending Payment -->
          <div class="border border-zinc-900 bg-zinc-900/10 p-5 rounded-lg space-y-2">
            <h3 class="text-sm font-bold text-white font-mono">Complete Pending Payment</h3>
            <p class="text-zinc-400 text-xs">
              When resuming a created enrollment checkout that was not completed, initialize with <code>paymentType: "pending_payment"</code>. The backend calculates remaining unpaid amount to request.
            </p>
            <pre class="bg-zinc-950 text-zinc-400 p-3 rounded text-[11px] font-mono"><code>{
  "paymentType": "pending_payment",
  "enrollmentId": 248 // ID of the existing enrollment
}</code></pre>
          </div>

          <!-- Renewals -->
          <div class="border border-zinc-900 bg-zinc-900/10 p-5 rounded-lg space-y-2">
            <h3 class="text-sm font-bold text-white font-mono">Renew Access (1 Year)</h3>
            <p class="text-zinc-400 text-xs">
              To renew an expired access or extend current access date by 1 year, send <code>paymentType: "renew"</code>. Once verify succeeds, <code>accessTill</code> date will be extended by 1 year.
            </p>
            <pre class="bg-zinc-950 text-zinc-400 p-3 rounded text-[11px] font-mono"><code>{
  "paymentType": "renew",
  "enrollmentId": 142
}</code></pre>
          </div>
        </div>
      </section>
    </div>
  </main>

  <footer class="border-t border-zinc-900 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500 font-mono">
    Codekaro Developers Reference Manual • 2026
  </footer>
</body>
</html>`;
}
