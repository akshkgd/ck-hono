import { PaymentRepository, type NewPayment } from '../../payments/payment.repository.js';
import { EnrollmentRepository } from '../../enrollments/enrollment.repository.js';
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentSearchQueryInput
} from '../../payments/payment.validation.js';

function sanitizeString(val: string | null | undefined): string | null {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
    return null;
  }
  return trimmed;
}

export class AdminPaymentsService {
  private paymentRepository: PaymentRepository;
  private enrollmentRepository: EnrollmentRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.enrollmentRepository = new EnrollmentRepository();
  }

  public async createPayment(input: CreatePaymentInput) {
    console.log("[DEBUG] createPayment invoked. input:", JSON.stringify(input, null, 2));

    // 1. Verify Batch Enrollment Exists
    const enrollment = await this.enrollmentRepository.findById(input.batchEnrollmentId);
    if (!enrollment) {
      console.log("[DEBUG] Enrollment not found for ID:", input.batchEnrollmentId);
      throw new Error('Batch enrollment not found');
    }

    const transactionId = sanitizeString(input.transactionId);
    const invoiceId = sanitizeString(input.invoiceId);
    const paymentMethod = sanitizeString(input.paymentMethod);
    const remarks = sanitizeString(input.remarks);
    const paidAtDate = (input.paidAt && input.paidAt.trim() !== '') ? new Date(input.paidAt) : new Date();

    console.log("[DEBUG] Sanitized fields:", {
      transactionId,
      invoiceId,
      paymentMethod,
      remarks,
      paidAtDate: paidAtDate.toISOString()
    });

    // 2. Verify Transaction ID Uniqueness
    if (transactionId) {
      const existingTx = await this.paymentRepository.findByTransactionId(transactionId);
      console.log("[DEBUG] existingTx query result for", transactionId, ":", JSON.stringify(existingTx, null, 2));
      if (existingTx) {
        console.log("[DEBUG] Uniqueness violation: Transaction ID already exists. existingTx ID:", existingTx.id);
        throw new Error('Transaction ID already exists');
      }
    }

    // 3. Verify Invoice ID Uniqueness
    if (invoiceId) {
      const existingInvoice = await this.paymentRepository.findByInvoiceId(invoiceId);
      console.log("[DEBUG] existingInvoice query result for", invoiceId, ":", JSON.stringify(existingInvoice, null, 2));
      if (existingInvoice) {
        console.log("[DEBUG] Uniqueness violation: Invoice ID already exists. existingInvoice ID:", existingInvoice.id);
        throw new Error('Invoice ID already exists');
      }
    }

    // 4. Create payment
    console.log("[DEBUG] Inserting payment into database...");
    const newPayment = await this.paymentRepository.create({
      ...input,
      paidAt: paidAtDate,
      transactionId,
      invoiceId,
      paymentMethod,
      remarks,
    });

    // Recalculate total amount paid on batch enrollment
    await this.enrollmentRepository.recalculateAmountPaid(input.batchEnrollmentId);

    return newPayment;
  }

  public async searchPayments(input: PaymentSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const payments = await this.paymentRepository.search(input.q, input.limit, offset, input.batchEnrollmentId);
    const total = await this.paymentRepository.count(input.q, input.batchEnrollmentId);

    return {
      payments,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }

  public async getPayment(id: number) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  public async updatePayment(id: number, input: UpdatePaymentInput) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    if (input.batchEnrollmentId) {
      const enrollment = await this.enrollmentRepository.findById(input.batchEnrollmentId);
      if (!enrollment) {
        throw new Error('Batch enrollment not found');
      }
    }

    const transactionId = input.transactionId !== undefined ? sanitizeString(input.transactionId) : undefined;
    const invoiceId = input.invoiceId !== undefined ? sanitizeString(input.invoiceId) : undefined;
    const paymentMethod = input.paymentMethod !== undefined ? sanitizeString(input.paymentMethod) : undefined;
    const remarks = input.remarks !== undefined ? sanitizeString(input.remarks) : undefined;
    const paidAtDate = input.paidAt !== undefined ? ((input.paidAt && input.paidAt.trim() !== '') ? new Date(input.paidAt) : new Date()) : undefined;

    if (transactionId && transactionId !== payment.transactionId) {
      const existingTx = await this.paymentRepository.findByTransactionId(transactionId);
      if (existingTx) {
        throw new Error('Transaction ID already exists');
      }
    }

    if (invoiceId && invoiceId !== payment.invoiceId) {
      const existingInvoice = await this.paymentRepository.findByInvoiceId(invoiceId);
      if (existingInvoice) {
        throw new Error('Invoice ID already exists');
      }
    }

    const updated = await this.paymentRepository.update(id, {
      ...input,
      paidAt: paidAtDate,
      transactionId,
      invoiceId,
      paymentMethod,
      remarks,
    });

    if (!updated) {
      throw new Error('Failed to update payment');
    }

    // Recalculate total amount paid on batch enrollment(s)
    await this.enrollmentRepository.recalculateAmountPaid(updated.batchEnrollmentId);
    if (payment.batchEnrollmentId !== updated.batchEnrollmentId) {
      await this.enrollmentRepository.recalculateAmountPaid(payment.batchEnrollmentId);
    }

    return updated;
  }

  public async deletePayment(id: number) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    await this.paymentRepository.delete(id);

    // Recalculate total amount paid on batch enrollment
    await this.enrollmentRepository.recalculateAmountPaid(payment.batchEnrollmentId);

    return true;
  }
}
