import { ContentLibraryRepository } from '../../content-library/content-library.repository.js';
import type { CreateContentLibraryInput, UpdateContentLibraryInput, ContentLibrarySearchQueryInput } from '../../content-library/content-library.validation.js';

export class AdminContentLibraryService {
  private contentLibraryRepository: ContentLibraryRepository;

  constructor() {
    this.contentLibraryRepository = new ContentLibraryRepository();
  }

  public async createItem(input: CreateContentLibraryInput) {
    const item = await this.contentLibraryRepository.create({
      title: input.title,
      desc: input.desc,
      type: input.type,
      contentType: input.contentType,
      videoLink: input.videoLink,
      videoDuration: input.videoDuration,
      assignment: input.assignment,
      xp: input.xp,
      solutionCode: input.solutionCode,
      hints: input.hints,
      metadata: input.metadata,
    });
    return item;
  }

  public async getItem(id: string) {
    const item = await this.contentLibraryRepository.findById(id);
    if (!item) {
      throw new Error('Content library item not found');
    }
    return item;
  }

  public async updateItem(id: string, input: UpdateContentLibraryInput) {
    const item = await this.contentLibraryRepository.findById(id);
    if (!item) {
      throw new Error('Content library item not found');
    }

    const updated = await this.contentLibraryRepository.update(id, input);
    if (!updated) {
      throw new Error('Failed to update content library item');
    }
    return updated;
  }

  public async deleteItem(id: string) {
    const item = await this.contentLibraryRepository.findById(id);
    if (!item) {
      throw new Error('Content library item not found');
    }
    await this.contentLibraryRepository.delete(id);
    return true;
  }

  public async searchItems(input: ContentLibrarySearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const items = await this.contentLibraryRepository.search(input.q, input.limit, offset, input.type, input.contentType);
    const total = await this.contentLibraryRepository.count(input.q, input.type, input.contentType);

    return {
      items,
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }
}
