import { BatchSectionRepository } from '../../batches/batch-section.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import type { CreateBatchSectionInput, UpdateBatchSectionInput, BatchSectionSearchQueryInput } from '../../batches/batch-section.validation.js';

export class AdminBatchSectionsService {
  private batchSectionRepository: BatchSectionRepository;
  private batchRepository: BatchRepository;

  constructor() {
    this.batchSectionRepository = new BatchSectionRepository();
    this.batchRepository = new BatchRepository();
  }

  public async createSection(input: CreateBatchSectionInput) {
    if (input.batchId) {
      const batch = await this.batchRepository.findById(input.batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }
    }

    const section = await this.batchSectionRepository.create({
      title: input.title,
      batchId: input.batchId,
      order: input.order,
    });
    return section;
  }

  public async getSection(id: number) {
    const section = await this.batchSectionRepository.findById(id);
    if (!section) {
      throw new Error('Batch section not found');
    }
    return section;
  }

  public async updateSection(id: number, input: UpdateBatchSectionInput) {
    const section = await this.batchSectionRepository.findById(id);
    if (!section) {
      throw new Error('Batch section not found');
    }

    if (input.batchId) {
      const batch = await this.batchRepository.findById(input.batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }
    }

    const updated = await this.batchSectionRepository.update(id, input);
    if (!updated) {
      throw new Error('Failed to update batch section');
    }
    return updated;
  }

  public async deleteSection(id: number) {
    const section = await this.batchSectionRepository.findById(id);
    if (!section) {
      throw new Error('Batch section not found');
    }
    await this.batchSectionRepository.delete(id);
    return true;
  }

  public async searchSections(input: BatchSectionSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const sections = await this.batchSectionRepository.search(input.q, input.limit, offset, input.batchId);
    const total = await this.batchSectionRepository.count(input.q, input.batchId);

    return {
      sections,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }
}
