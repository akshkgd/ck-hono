import { describe, it, expect } from 'vitest';
import { generateBunnySignedUrl, TARGET_BUNNY_PULL_ZONE_HOST } from './bunny-token.util.js';

describe('generateBunnySignedUrl', () => {
  it('should return null if videoLink is empty or null', () => {
    expect(generateBunnySignedUrl('')).toBeNull();
    expect(generateBunnySignedUrl(null)).toBeNull();
    expect(generateBunnySignedUrl(undefined)).toBeNull();
  });

  it('should return null if videoLink is not on the target pull zone', () => {
    expect(generateBunnySignedUrl('https://vz-other-library.b-cdn.net/12345/playlist.m3u8')).toBeNull();
    expect(generateBunnySignedUrl('https://vimeo.com/123456')).toBeNull();
  });

  it('should generate a valid Bunny CDN Advanced HMAC-SHA256 signed URL with HS256- prefix and token_path in signingData', () => {
    const videoLink = `https://${TARGET_BUNNY_PULL_ZONE_HOST}/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8`;
    const result = generateBunnySignedUrl(videoLink, 'a76208b9-62ac-4996-9ee1-d7ff92e9576f');

    expect(result).not.toBeNull();
    expect(result?.signedUrl).toBeDefined();
    expect(result?.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));

    const signedUrl = result!.signedUrl;
    expect(signedUrl).toContain(`https://${TARGET_BUNNY_PULL_ZONE_HOST}/bcdn_token=HS256-`);
    expect(signedUrl).toContain('&expires=');
    expect(signedUrl).toContain('&token_path=%2F5a8e9321-abcd-1234-efgh-567890123456%2F');
    expect(signedUrl).toContain('limit=1000');
    expect(signedUrl).toContain('/5a8e9321-abcd-1234-efgh-567890123456/playlist.m3u8');
  });

  it('should set expiry timestamp to exactly 3 hours (10800 seconds) by default', () => {
    const now = Math.floor(Date.now() / 1000);
    const videoLink = `https://${TARGET_BUNNY_PULL_ZONE_HOST}/vid-123/playlist.m3u8`;
    const result = generateBunnySignedUrl(videoLink, 'test-key');

    expect(result).not.toBeNull();
    expect(result!.expiresAt - now).toBeGreaterThanOrEqual(10798);
    expect(result!.expiresAt - now).toBeLessThanOrEqual(10802);
  });
});
