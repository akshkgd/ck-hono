import { BatchContentRepository } from '../../batch-content/batch-content.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import { BatchSectionRepository } from '../../batches/batch-section.repository.js';
import { ContentLibraryRepository } from '../../content-library/content-library.repository.js';
import type {
  CreateBatchContentInput,
  UpdateBatchContentInput,
  BatchContentSearchQueryInput
} from '../../batch-content/batch-content.validation.js';

export class AdminBatchContentService {
  private batchContentRepository: BatchContentRepository;
  private batchRepository: BatchRepository;
  private batchSectionRepository: BatchSectionRepository;
  private contentLibraryRepository: ContentLibraryRepository;

  constructor() {
    this.batchContentRepository = new BatchContentRepository();
    this.batchRepository = new BatchRepository();
    this.batchSectionRepository = new BatchSectionRepository();
    this.contentLibraryRepository = new ContentLibraryRepository();
  }

  public async createBatchContent(input: CreateBatchContentInput) {
    // 1. Verify Batch Exists
    const batch = await this.batchRepository.findById(input.batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }

    // 2. Verify Section Exists
    const section = await this.batchSectionRepository.findById(input.sectionId);
    if (!section) {
      throw new Error('Batch section not found');
    }
    if (section.batchId !== input.batchId) {
      throw new Error('Batch section does not belong to the specified batch');
    }

    // 3. Verify Content Item Exists
    const content = await this.contentLibraryRepository.findById(input.contentId);
    if (!content) {
      throw new Error('Content library item not found');
    }

    // 4. Create record
    const record = await this.batchContentRepository.create({
      ...input,
      accessOnDate: input.accessOnDate ?? null,
      accessTillDate: input.accessTillDate ?? null,
    });

    return record;
  }

  public async getBatchContent(id: number) {
    const record = await this.batchContentRepository.findById(id);
    if (!record) {
      throw new Error('Batch content linkage not found');
    }
    return record;
  }

  public async updateBatchContent(id: number, input: UpdateBatchContentInput) {
    const record = await this.batchContentRepository.findById(id);
    if (!record) {
      throw new Error('Batch content linkage not found');
    }

    if (input.batchId) {
      const batch = await this.batchRepository.findById(input.batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }
    }

    if (input.sectionId) {
      const section = await this.batchSectionRepository.findById(input.sectionId);
      if (!section) {
        throw new Error('Batch section not found');
      }
      const batchIdToCheck = input.batchId || record.batchId;
      if (section.batchId !== batchIdToCheck) {
        throw new Error('Batch section does not belong to the specified batch');
      }
    }

    if (input.contentId) {
      const content = await this.contentLibraryRepository.findById(input.contentId);
      if (!content) {
        throw new Error('Content library item not found');
      }
    }

    const updated = await this.batchContentRepository.update(id, {
      ...input,
      accessOnDate: input.accessOnDate ?? undefined,
      accessTillDate: input.accessTillDate ?? undefined,
    });

    if (!updated) {
      throw new Error('Failed to update batch content linkage');
    }

    return updated;
  }

  public async deleteBatchContent(id: number) {
    const record = await this.batchContentRepository.findById(id);
    if (!record) {
      throw new Error('Batch content linkage not found');
    }
    await this.batchContentRepository.delete(id);
    return true;
  }

  public async searchBatchContents(input: BatchContentSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const items = await this.batchContentRepository.search(input.limit, offset, input.batchId, input.sectionId);
    const total = await this.batchContentRepository.count(input.batchId, input.sectionId);

    return {
      items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }

  public async reorderBatchContents(orders: { id: number; order: number }[]) {
    await this.batchContentRepository.updateOrders(orders);
    return true;
  }
}
