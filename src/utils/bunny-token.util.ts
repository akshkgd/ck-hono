import crypto from 'crypto';

export interface BunnySignedUrlResult {
  signedUrl: string;
  expiresAt: number;
}

export const TARGET_BUNNY_PULL_ZONE_HOST = 'vz-09b5be34-aef.b-cdn.net';
export const DEFAULT_BUNNY_TTL_SECONDS = 3 * 3600; // 3 hours (10800 seconds)
const envLimit = process.env.BUNNY_CDN_LIMIT_KBPS ? parseInt(process.env.BUNNY_CDN_LIMIT_KBPS, 10) : 0;
export const DEFAULT_DOWNLOAD_LIMIT_KBPS = Number.isNaN(envLimit) ? 0 : envLimit;

/**
 * Generates a Bunny CDN Advanced Token Authentication (HMAC-SHA256) signed URL.
 * Specification:
 * - HMAC algorithm: HMAC-SHA256 using security_key as HMAC secret.
 * - Token Format: HS256-<Base64URL(HMAC-SHA256(security_key, signature_path + expires + user_ip + signing_data))>
 * - signing_data contains alphabetically sorted key=value pairs for parameters excluding token & expires.
 * - Base64URL encoding (no padding, '+' -> '-', '/' -> '_').
 * - Directory path-based token for HLS streaming.
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

  let hostname = '';
  let videoId = '';
  let filename = 'playlist.m3u8';

  try {
    const parsedUrl = new URL(videoLink.startsWith('http') ? videoLink : `https://${videoLink}`);
    if (!parsedUrl.hostname.endsWith('.b-cdn.net')) {
      return null;
    }
    hostname = parsedUrl.hostname;
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      videoId = segments[0];
    }
    if (segments.length > 1) {
      filename = segments.slice(1).join('/');
    }
  } catch {
    const match = videoLink.match(/([a-zA-Z0-9-]+\.b-cdn\.net)\/([^\/]+)(?:\/(.*))?/);
    if (match && match[1] && match[2]) {
      hostname = match[1];
      videoId = match[2];
      if (match[3]) {
        filename = match[3];
      }
    }
  }

  if (!hostname || !videoId) {
    return null;
  }

  const rawKey = tokenKey || process.env.BUNNY_CDN_TOKEN_KEY || '';
  const key = rawKey.trim().replace(/^["']|["']$/g, '');
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;

  // Path-based directory access for HLS video streaming (e.g. /5a8e9321-abcd-1234-efgh-567890123456/)
  const tokenPath = `/${videoId}/`;
  const signaturePath = tokenPath;
  const userIp = ''; // No IP locking

  // Parameters map excluding token & expires, sorted alphabetically by parameter name
  const paramsMap = new Map<string, string>();
  if (limitKBps > 0) {
    paramsMap.set('limit', String(limitKBps));
  }
  paramsMap.set('token_path', tokenPath);

  const sortedKeys = Array.from(paramsMap.keys()).sort();
  const signingData = sortedKeys.map(k => `${k}=${paramsMap.get(k)}`).join('&');

  // HMAC message construction per Bunny spec: signature_path + expires + user_ip + signing_data
  const messageToSign = signaturePath + expiresAt + userIp + signingData;

  // Perform HMAC-SHA256 with security_key
  const hmacDigest = crypto
    .createHmac('sha256', key)
    .update(messageToSign)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const token = `HS256-${hmacDigest}`;
  const encodedTokenPath = encodeURIComponent(tokenPath); // %2F{videoId}%2F

  let pathQueryParams = `token_path=${encodedTokenPath}`;
  if (limitKBps > 0) {
    pathQueryParams = `limit=${limitKBps}&${pathQueryParams}`;
  }

  const signedUrl = `https://${hostname}/${videoId}/${filename}?token=${token}&expires=${expiresAt}&${pathQueryParams}`;

  return {
    signedUrl,
    expiresAt,
  };
}
