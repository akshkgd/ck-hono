import crypto from 'crypto';

export interface BunnySignedUrlResult {
  signedUrl: string;
  expiresAt: number;
}

export const TARGET_BUNNY_PULL_ZONE_HOST = 'vz-09b5be34-aef.b-cdn.net';
export const DEFAULT_BUNNY_TTL_SECONDS = 3 * 3600; // 3 hours (10800 seconds)
export const DEFAULT_DOWNLOAD_LIMIT_KBPS = 1000;

/**
 * Generates a Bunny CDN SHA-256 token-authenticated signed HLS URL for protected video streams.
 * Only processes videos originating from the targeted Pull Zone (vz-09b5be34-aef.b-cdn.net).
 * Returns null if the URL is not on the target pull zone or if videoId cannot be extracted.
 */
export function generateBunnySignedUrl(
  videoLink: string | null | undefined,
  tokenKey?: string,
  ttlSeconds: number = DEFAULT_BUNNY_TTL_SECONDS,
  limitKBps: number = DEFAULT_DOWNLOAD_LIMIT_KBPS
): BunnySignedUrlResult | null {
  if (!videoLink) {
    return null;
  }

  // Strictly target vz-09b5be34-aef.b-cdn.net
  if (!videoLink.includes(TARGET_BUNNY_PULL_ZONE_HOST)) {
    return null;
  }

  let videoId = '';
  try {
    const parsedUrl = new URL(videoLink.startsWith('http') ? videoLink : `https://${videoLink}`);
    if (parsedUrl.hostname !== TARGET_BUNNY_PULL_ZONE_HOST) {
      return null;
    }
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      videoId = segments[0];
    }
  } catch {
    // If URL parsing fails, attempt regex fallback
    const match = videoLink.match(/vz-09b5be34-aef\.b-cdn\.net\/([^\/]+)/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (!videoId) {
    return null;
  }

  const key = tokenKey || process.env.BUNNY_CDN_TOKEN_KEY || '';
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const videoPath = `/${videoId}/`;
  const hashableBase = key + videoPath + expiresAt;

  const token = Buffer.from(
    crypto.createHash('sha256').update(hashableBase).digest()
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const encodedTokenPath = encodeURIComponent(videoPath); // %2F{videoId}%2F
  const signedUrl = `https://${TARGET_BUNNY_PULL_ZONE_HOST}/bcdn_token=${token}&expires=${expiresAt}&token_path=${encodedTokenPath}&limit=${limitKBps}/${videoId}/playlist.m3u8`;

  return {
    signedUrl,
    expiresAt,
  };
}
