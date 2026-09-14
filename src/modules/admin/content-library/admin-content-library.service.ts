import { ContentLibraryRepository } from '../../content-library/content-library.repository.js';
import type { CreateContentLibraryInput, UpdateContentLibraryInput, ContentLibrarySearchQueryInput } from '../../content-library/content-library.validation.js';
import { generateBunnySignedUrl } from '../../../utils/bunny-token.util.js';

export class AdminContentLibraryService {
  private contentLibraryRepository: ContentLibraryRepository;

  constructor() {
    this.contentLibraryRepository = new ContentLibraryRepository();
  }

  private attachSignedUrl<T extends { videoLink?: string | null }>(item: T) {
    if (!item) return item;
    if (item.videoLink) {
      const signedResult = generateBunnySignedUrl(item.videoLink);
      if (signedResult) {
        return {
          ...item,
          signedUrl: signedResult.signedUrl,
          expiresAt: signedResult.expiresAt,
        };
      }
      return {
        ...item,
        signedUrl: item.videoLink,
        expiresAt: null,
      };
    }
    return {
      ...item,
      signedUrl: null,
      expiresAt: null,
    };
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
    return this.attachSignedUrl(item);
  }

  public async getItem(id: string) {
    const item = await this.contentLibraryRepository.findById(id);
    if (!item) {
      throw new Error('Content library item not found');
    }
    return this.attachSignedUrl(item);
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
    return this.attachSignedUrl(updated);
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
      items: items.map(item => this.attachSignedUrl(item)),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
      }
    };
  }
}

