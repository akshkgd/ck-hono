import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AdminContentLibraryService } from './admin-content-library.service.js';
import { TARGET_BUNNY_PULL_ZONE_HOST } from '../../../utils/bunny-token.util.js';

// Mock repository
const mockRepository = {
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  search: vi.fn(),
  count: vi.fn(),
};

vi.mock('../../content-library/content-library.repository.js', () => {
  return {
    ContentLibraryRepository: class {
      create = mockRepository.create;
      findById = mockRepository.findById;
      update = mockRepository.update;
      delete = mockRepository.delete;
      search = mockRepository.search;
      count = mockRepository.count;
    },
  };
});

describe('AdminContentLibraryService - HLS Signed URL Generation', () => {
  let service: AdminContentLibraryService;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.BUNNY_CDN_TOKEN_KEY = 'test-secret-key';
    service = new AdminContentLibraryService();
  });

  const mockItem = {
    id: '66919bb6-f955-4cd6-b31b-1dd77bccc617',
    title: 'Intro to Node & File system',
    desc: '<p>Source code</p>',
    type: 'video',
    contentType: 'primary',
    videoLink: `https://${TARGET_BUNNY_PULL_ZONE_HOST}/143aeeff-e353-4b64-8a8c-204d777bdbcc/playlist.m3u8`,
    videoDuration: 2277,
    xp: null,
    solutionCode: null,
    hints: null,
    metadata: {},
    createdAt: new Date('2026-08-01T12:40:56.231Z'),
    updatedAt: new Date('2026-08-01T12:40:56.231Z'),
  };

  it('should replace videoLink with signed URL for getItem when videoLink matches Bunny pull zone', async () => {
    mockRepository.findById.mockResolvedValue(mockItem);

    const result = await service.getItem('66919bb6-f955-4cd6-b31b-1dd77bccc617');

    expect(result).toBeDefined();
    expect(result.id).toBe(mockItem.id);
    expect(result.videoLink).toContain(`https://${TARGET_BUNNY_PULL_ZONE_HOST}/bcdn_token=HS256-`);
    expect(result.videoLink).toContain('token_path=%2F143aeeff-e353-4b64-8a8c-204d777bdbcc%2F');
    expect(result.videoLink).toContain('/143aeeff-e353-4b64-8a8c-204d777bdbcc/playlist.m3u8');
  });

  it('should return original videoLink unchanged if non-Bunny video link', async () => {
    const nonBunnyItem = {
      ...mockItem,
      videoLink: 'https://vimeo.com/123456',
    };
    mockRepository.findById.mockResolvedValue(nonBunnyItem);

    const result = await service.getItem('66919bb6-f955-4cd6-b31b-1dd77bccc617');

    expect(result.videoLink).toBe('https://vimeo.com/123456');
  });

  it('should return videoLink as null if videoLink is null', async () => {
    const noVideoItem = {
      ...mockItem,
      videoLink: null,
    };
    mockRepository.findById.mockResolvedValue(noVideoItem);

    const result = await service.getItem('66919bb6-f955-4cd6-b31b-1dd77bccc617');

    expect(result.videoLink).toBeNull();
  });

  it('should replace videoLink with signed URL for searchItems list', async () => {
    mockRepository.search.mockResolvedValue([mockItem]);
    mockRepository.count.mockResolvedValue(1);

    const result = await service.searchItems({ q: '', page: 1, limit: 10 });

    expect(result.items.length).toBe(1);
    expect(result.items[0].videoLink).toContain(`https://${TARGET_BUNNY_PULL_ZONE_HOST}/bcdn_token=HS256-`);
  });
});
