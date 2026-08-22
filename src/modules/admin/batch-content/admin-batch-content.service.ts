import { BatchContentRepository } from '../../batch-content/batch-content.repository.js';
import { BatchRepository } from '../../batches/batch.repository.js';
import { BatchSectionRepository } from '../../batches/batch-section.repository.js';
import { ContentLibraryRepository } from '../../content-library/content-library.repository.js';
import { AdminLiveSessionsRepository } from '../live-sessions/admin-live-sessions.repository.js';
import type {
  CreateBatchContentInput,
  UpdateBatchContentInput,
  BatchContentSearchQueryInput,
  CreateBulkBatchContentInput,
  ImportBatchContentInput
} from '../../batch-content/batch-content.validation.js';

export class AdminBatchContentService {
  private batchContentRepository: BatchContentRepository;
  private batchRepository: BatchRepository;
  private batchSectionRepository: BatchSectionRepository;
  private contentLibraryRepository: ContentLibraryRepository;
  private liveSessionsRepository: AdminLiveSessionsRepository;

  constructor() {
    this.batchContentRepository = new BatchContentRepository();
    this.batchRepository = new BatchRepository();
    this.batchSectionRepository = new BatchSectionRepository();
    this.contentLibraryRepository = new ContentLibraryRepository();
    this.liveSessionsRepository = new AdminLiveSessionsRepository();
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

  public async createBulkBatchContent(input: CreateBulkBatchContentInput) {
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

    // 3. Verify All Content Items Exist
    for (const item of input.items) {
      const content = await this.contentLibraryRepository.findById(item.contentId);
      if (!content) {
        throw new Error(`Content library item with ID ${item.contentId} not found`);
      }
    }

    // 4. Create bulk records in transaction
    const records = await this.batchContentRepository.createBulk(
      input.batchId,
      input.sectionId,
      input.items
    );

    return records;
  }

  public async getBatchContent(id: string) {
    const record = await this.batchContentRepository.findById(id);
    if (!record) {
      throw new Error('Batch content linkage not found');
    }
    return record;
  }

  public async updateBatchContent(id: string, input: UpdateBatchContentInput) {
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

  public async deleteBatchContent(id: string) {
    const record = await this.batchContentRepository.findById(id);
    if (!record) {
      throw new Error('Batch content linkage not found');
    }
    await this.batchContentRepository.delete(id);
    return true;
  }

  public async searchBatchContents(input: BatchContentSearchQueryInput) {
    let includeLiveSessions = false;
    let targetBatch: any = null;

    if (input.batchId) {
      targetBatch = await this.batchRepository.findById(input.batchId);
      if (targetBatch && (targetBatch.type === 'cohort' || targetBatch.type === 'live')) {
        includeLiveSessions = true;
      }
    } else if (input.sectionId) {
      const section = await this.batchSectionRepository.findById(input.sectionId);
      if (section && section.batchId) {
        targetBatch = await this.batchRepository.findById(section.batchId);
        if (targetBatch && (targetBatch.type === 'cohort' || targetBatch.type === 'live')) {
          includeLiveSessions = true;
        }
      }
    }

    if (!includeLiveSessions) {
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

    const batchIdToFetch = input.batchId || targetBatch?.id;
    const [rawContentItems, liveSessionItems] = await Promise.all([
      this.batchContentRepository.search(10000, 0, batchIdToFetch, input.sectionId),
      batchIdToFetch ? this.liveSessionsRepository.findByBatchId(batchIdToFetch, input.sectionId) : Promise.resolve([])
    ]);

    const formattedLiveSessions = liveSessionItems.map((session) => ({
      id: session.id,
      batchId: session.batchId,
      contentId: null,
      sectionId: session.sectionId,
      order: session.order,
      accessOn: 0,
      accessTill: 0,
      accessOnDate: null,
      accessTillDate: null,
      canSubmitAssignment: false,
      metadata: {},
      type: 'live_session',
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      batch: {
        name: targetBatch?.name || '',
      },
      section: {
        title: session.sectionId ? '' : null,
      },
      content: {
        title: session.topic,
        type: 'video',
        contentType: 'live_session',
        desc: session.desc,
        videoLink: session.recordingHls || session.screenHlsVideo || session.faceHlsVideo || null,
        videoUrl: session.recordingHls || session.screenHlsVideo || session.faceHlsVideo || null,
        videoDuration: null,
        assignment: null,
        time: session.time,
        screenHlsVideo: session.screenHlsVideo,
        faceHlsVideo: session.faceHlsVideo,
        recordingHls: session.recordingHls,
      }
    }));

    const combinedItems = [...rawContentItems, ...formattedLiveSessions];
    combinedItems.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const total = combinedItems.length;
    const offset = (input.page - 1) * input.limit;
    const paginatedItems = combinedItems.slice(offset, offset + input.limit);

    return {
      items: paginatedItems,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }

  public async reorderBatchContents(orders: { id: string; order: number }[]) {
    await this.batchContentRepository.updateOrders(orders);
    return true;
  }

  public async importBatchContent(input: ImportBatchContentInput) {
    const sourceBatch = await this.batchRepository.findById(input.sourceBatchId);
    if (!sourceBatch) {
      throw new Error('Source batch not found');
    }

    const targetBatch = await this.batchRepository.findById(input.targetBatchId);
    if (!targetBatch) {
      throw new Error('Target batch not found');
    }

    return this.batchContentRepository.importFromBatch(input.sourceBatchId, input.targetBatchId);
  }

  public async resetAccessTillToZero() {
    return this.batchContentRepository.resetAccessTillToZero();
  }
}

