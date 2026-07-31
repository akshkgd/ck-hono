import { BatchRepository, type NewBatch } from '../../batches/batch.repository.js';
import type { CreateBatchInput, UpdateBatchInput, BatchSearchQueryInput } from '../../batches/batch.validation.js';
import { AdminLiveSessionsRepository } from '../live-sessions/admin-live-sessions.repository.js';

export class AdminBatchesService {
  private batchRepository: BatchRepository;
  private liveSessionsRepository: AdminLiveSessionsRepository;

  constructor() {
    this.batchRepository = new BatchRepository();
    this.liveSessionsRepository = new AdminLiveSessionsRepository();
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

  public async getBatch(id: string) {
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

  public async updateBatch(id: string, input: UpdateBatchInput) {
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

  public async deleteBatch(id: string) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new Error('Batch not found');
    }
    await this.batchRepository.delete(id);
    return true;
  }

  public async getBatchPreview(id: string) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new Error('Batch not found');
    }

    const [curriculum, liveSessions] = await Promise.all([
      this.batchRepository.getBatchCurriculum(id),
      this.liveSessionsRepository.findByBatchId(id)
    ]);

    const { sections, contents } = curriculum;

    // Group contents by section ID
    const sectionsMap = new Map<string, any[]>();
    for (const section of sections) {
      sectionsMap.set(section.id, []);
    }
    const unassignedContents: any[] = [];

    for (const item of contents) {
      const sId = item.sectionId;
      const contentMapped = {
        ...item,
        type: 'content_library'
      };
      if (sId && sectionsMap.has(sId)) {
        sectionsMap.get(sId)!.push(contentMapped);
      } else {
        unassignedContents.push(contentMapped);
      }
    }

    for (const sessionItem of liveSessions) {
      const sId = sessionItem.sectionId;
      const liveSessionMapped = {
        id: sessionItem.id,
        sectionId: sessionItem.sectionId,
        order: sessionItem.order,
        type: 'live_session',
        content: {
          title: sessionItem.topic,
          type: 'video', // for frontend representation
          contentType: 'live_session',
          desc: sessionItem.desc,
          time: sessionItem.time,
          screenHlsVideo: sessionItem.screenHlsVideo,
          faceHlsVideo: sessionItem.faceHlsVideo,
          recordingHls: sessionItem.recordingHls,
          xp: 0
        }
      };
      if (sId && sectionsMap.has(sId)) {
        sectionsMap.get(sId)!.push(liveSessionMapped);
      } else {
        unassignedContents.push(liveSessionMapped);
      }
    }

    // Sort items inside each section by their 'order' property
    for (const [_, items] of sectionsMap.entries()) {
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    unassignedContents.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const sectionsWithContents = sections.map(section => ({
      ...section,
      contents: sectionsMap.get(section.id) || [],
    }));

    return {
      batch,
      sections: sectionsWithContents,
      unassignedContents
    };
  }

  public async unlockAssignments(batchId: string): Promise<number> {
    const batch = await this.batchRepository.findById(batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }
    return await this.batchRepository.unlockBatchAssignments(batchId);
  }
}
