import { ep, p, SAMPLE, section, type Page } from '../kit.js';

export const razorpay: Page = {
  path: 'payments/razorpay',
  title: 'Razorpay payments',
  group: 'Payments',
  summary: 'Create an order, open Razorpay Checkout, verify the signature, and let the webhook act as the safety net.',
  items: [
    section('flow', 'Payment flow', `
<ol>
  <li>Client calls <a href="#create-order">Create order</a> with the batch (or enrollment) and, for guests, email and phone.</li>
  <li>Client opens Razorpay Checkout with the returned <code class="ic">keyId</code>, <code class="ic">orderId</code> and <code class="ic">amount</code>.</li>
  <li>On success, the client posts the three <code class="ic">razorpay_*</code> values to <a href="#verify">Verify payment</a>. The server checks the HMAC signature, fetches the payment from Razorpay, records it and activates the enrollment.</li>
  <li>Razorpay independently calls the <a href="#webhook">webhook</a> with <code class="ic">payment.captured</code>. Both paths use the same processing function, and the transaction id is used to skip a payment that was already recorded, so running both is safe.</li>
</ol>
<ul>
  <li>Currency is always <strong>INR</strong>. Amounts in this API are rupees; the order is created in paise (×100).</li>
  <li>A new enrollment is created up front with <code class="ic">paymentStatus: "created"</code>, <code class="ic">status: 0</code>. It becomes active (<code class="ic">status: 1</code>) once payments cover <code class="ic">amountPayable</code>.</li>
  <li>The order id is stored in the enrollment's <code class="ic">metadata.razorpayOrderId</code>, and verification rejects a mismatching order id.</li>
</ul>`),
    ep({
      id: 'create-order',
      method: 'POST',
      path: '/payments/razorpay/create-order',
      access: 'optional',
      title: 'Create an order',
      desc: 'Creates (or reuses) an enrollment and a Razorpay order. Works for signed-in students and for guests. Parameters may be sent in the JSON body or the query string; body values win.',
      body: [
        p('paymentType', "'enrollment' | 'pending_payment' | 'renew'", "default 'enrollment'", '`enrollment`: buy a batch. `pending_payment`: pay the unpaid balance of an enrollment. `renew`: pay the batch renewal fee to extend access.'),
        p('batchId', 'string', "required when paymentType = 'enrollment'", 'Batch to buy.'),
        p('enrollmentId', 'string', "required when paymentType = 'pending_payment' or 'renew'", 'Existing enrollment.'),
        p('email', 'email', 'required for guests', 'Guest checkout email. A student account is created automatically if none exists.'),
        p('phone', 'string 10–15', 'required for guests', 'Guest phone number.'),
        p('name', 'string ≤ 255', 'optional', 'Guest display name (defaults to the email prefix).'),
      ],
      bodyExample: { paymentType: 'enrollment', batchId: SAMPLE.uuid, email: 'asha@example.com', phone: '9876543210', name: 'Asha Verma' },
      notes: [
        '**Amount.** `enrollment`: the enrollment\'s remaining balance (the batch price for a new one). `pending_payment`: `amountPayable - amountPaid`. `renew`: the batch `renewalFee`.',
        '**Guests.** With no session, `email` and `phone` are mandatory. An unknown email gets a new `student` user with a random password and unverified email; the caller is signed in after verification.',
        'Re-running `enrollment` for an unpaid enrollment reuses it instead of creating a duplicate.',
      ],
      response: {
        status: 201,
        example: { status: 'success', data: { keyId: 'rzp_live_xxxxxxxx', orderId: 'order_Nk3x9d2LqP0aZ1', amount: 1499900, currency: 'INR', enrollmentId: SAMPLE.uuid2 } },
        note: '`amount` is in paise, ready to pass to Checkout.',
      },
      errors: [
        [400, '`Email and phone are required for guest checkout`.'],
        [400, '`Batch not found`, `This batch price is invalid or not set`, `Batch renewal price is invalid or not set`.'],
        [400, '`You are already enrolled in this course` (captured enrollment exists).'],
        [400, '`Enrollment not found`, `Payment already completed for this enrollment`, `Invalid payment amount calculated`.'],
        [400, '`Razorpay API keys are not configured in environment variables` or a `Razorpay API Error (...)` passthrough.'],
      ],
    }),
    ep({
      id: 'verify',
      method: 'POST',
      path: '/payments/razorpay/verify',
      access: 'public',
      title: 'Verify a payment',
      desc: 'Verifies the Checkout signature (`HMAC-SHA256(order_id|payment_id)` with the key secret), confirms the order belongs to the enrollment, loads the payment from Razorpay, records it, and activates the enrollment.',
      body: [
        p('enrollmentId', 'string', 'required', '`enrollmentId` from the create-order response.'),
        p('razorpay_payment_id', 'string', 'required', 'From Checkout.'),
        p('razorpay_order_id', 'string', 'required', 'From Checkout.'),
        p('razorpay_signature', 'string', 'required', 'From Checkout.'),
      ],
      bodyExample: { enrollmentId: SAMPLE.uuid2, razorpay_payment_id: 'pay_Nk3x9d2LqP0aZ1', razorpay_order_id: 'order_Nk3x9d2LqP0aZ1', razorpay_signature: '9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d' },
      notes: [
        'Not session-protected: the signature is the proof.',
        '**Auto sign-in.** If the enrollment\'s user has role `student`, a session is created and `data.token` is returned. The same token is also set as the `better-auth.session_token` cookie (HttpOnly, SameSite=Lax, 30 days, Secure in production). Admins and other roles are never signed in this way.',
        '**Renewals** extend `accessTill` by one year from whichever is later: the current expiry or today.',
        'Background emails are queued: a payment receipt, plus an access-granted email (renewals) or an enrollment email (everything else).',
        'Recording the payment is idempotent on `transactionId`.',
      ],
      response: {
        status: 200,
        example: {
          status: 'success',
          message: 'Payment successfully verified',
          data: {
            enrollmentId: SAMPLE.uuid2,
            paymentId: 'pay_Nk3x9d2LqP0aZ1',
            orderId: 'order_Nk3x9d2LqP0aZ1',
            batchName: 'Full-Stack Cohort',
            batchTopic: 'Web development',
            paymentType: 'enrollment',
            token: 'q8v...session-token',
            user: { id: SAMPLE.uuid, email: 'asha@example.com', name: 'Asha Verma', role: 'student' },
          },
        },
        note: '`token` and `user` are omitted for non-student users.',
      },
      errors: [[400, '`Invalid signature verification failed`, `Enrollment not found`, `Order ID mismatch or invalid request context`, or `Razorpay secret key not configured`.']],
    }),
    ep({
      id: 'webhook',
      method: 'POST',
      path: '/payments/razorpay/webhook',
      access: 'webhook',
      title: 'Razorpay webhook',
      desc: 'Receiver for Razorpay events. Configure it in the Razorpay dashboard with the same secret as `RAZORPAY_WEBHOOK_SECRET`.',
      headers: [p('X-Razorpay-Signature', 'string', 'required', 'HMAC-SHA256 of the **raw** request body with the webhook secret.')],
      notes: [
        'Only `payment.captured` is acted on. The enrollment is found from `payment.notes.enrollmentId`, which the order creation step stores.',
        'Any other event, or a captured payment without an `enrollmentId` note, is acknowledged with 200 and `status: "ignored"`.',
        'Send the body unmodified: the signature is computed over the exact bytes received.',
      ],
      response: { status: 200, example: { status: 'success' }, note: 'Ignored events return `{ "status": "ignored", "reason": "Unhandled event type" }`.' },
      errors: [[400, '`Invalid webhook signature` or `Razorpay webhook secret not configured`. Razorpay retries non-2xx responses.']],
    }),
    section('test', 'Testing', `
<p>Use Razorpay test keys (<code class="ic">RAZORPAY_KEY_ID</code> starting <code class="ic">rzp_test_</code>) and Razorpay's test cards. The <a href="/playground">Playground</a> can exercise the create-order call. See <a href="/docs/v2/reference/environment">Environment</a> for the required variables.</p>`),
  ],
};
