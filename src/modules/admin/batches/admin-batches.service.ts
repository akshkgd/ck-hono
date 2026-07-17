import { BatchRepository, type NewBatch } from '../../batches/batch.repository.js';
import type { CreateBatchInput, UpdateBatchInput, BatchSearchQueryInput } from '../../batches/batch.validation.js';

export class AdminBatchesService {
  private batchRepository: BatchRepository;

  constructor() {
    this.batchRepository = new BatchRepository();
  }

  public async createBatch(input: CreateBatchInput) {
    if (input.slug) {
      const existing = await this.batchRepository.findBySlug(input.slug);
      if (existing) {
        throw new Error('Batch slug already exists');
      }
    }
    
    // Convert nextClass string to Date if provided
    const newBatch = await this.batchRepository.create({
      ...input,
      nextClass: input.nextClass ? new Date(input.nextClass) : null,
    });
    return newBatch;
  }

  public async searchBatches(input: BatchSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const batches = await this.batchRepository.search(input.q, input.limit, offset, input.type, input.status);
    const total = await this.batchRepository.count(input.q, input.type, input.status);

    return {
      batches,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }

  public async getBatch(id: number) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new Error('Batch not found');
    }
    const stats = await this.batchRepository.getBatchStats(id);
    return {
      ...batch,
      totalEnrollments: stats.totalEnrollments,
      totalRevenue: stats.totalRevenue,
    };
  }

  public async updateBatch(id: number, input: UpdateBatchInput) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new Error('Batch not found');
    }

    if (input.slug && input.slug !== batch.slug) {
      const existing = await this.batchRepository.findBySlug(input.slug);
      if (existing) {
        throw new Error('Batch slug already in use');
      }
    }

    const updated = await this.batchRepository.update(id, {
      ...input,
      nextClass: input.nextClass ? new Date(input.nextClass) : undefined,
    });

    if (!updated) {
      throw new Error('Failed to update batch');
    }
    return updated;
  }

  public async deleteBatch(id: number) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new Error('Batch not found');
    }
    await this.batchRepository.delete(id);
    return true;
  }
}
