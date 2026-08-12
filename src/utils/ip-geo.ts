import { redis, isRedisReady } from './redis.js';

interface GeoLocation {
  country: string;
  city: string;
}

const localGeoCache = new Map<string, GeoLocation>();

function isPrivateIp(ip: string): boolean {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('127.')) return true;
  if (ip.startsWith('172.') && parseInt(ip.split('.')[1] || '0', 10) >= 16 && parseInt(ip.split('.')[1] || '0', 10) <= 31) return true;
  if (ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) return true;
  return false;
}

export function cleanClientIp(rawIp: string | null | undefined): string | null {
  if (!rawIp) return null;
  const firstIp = rawIp.split(',')[0]?.trim() || '';
  const cleaned = firstIp.replace(/^::ffff:/, '');
  return cleaned || null;
}

export async function lookupIpLocation(ip: string): Promise<GeoLocation> {
  const cleanIp = cleanClientIp(ip);
  if (!cleanIp || isPrivateIp(cleanIp)) {
    return { country: 'Unknown', city: 'Unknown' };
  }

  // 1. Check local in-memory cache
  if (localGeoCache.has(cleanIp)) {
    return localGeoCache.get(cleanIp)!;
  }

  // 2. Check Redis cache if ready
  if (redis && isRedisReady()) {
    try {
      const cached = await redis.get(`geo:${cleanIp}`);
      if (cached) {
        const parsed = JSON.parse(cached) as GeoLocation;
        localGeoCache.set(cleanIp, parsed);
        return parsed;
      }
    } catch (_) {}
  }

  // 3. Perform IP Geolocation lookup via free ip-api service
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(cleanIp)}?fields=status,country,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json() as any;
      if (data && data.status === 'success') {
        const result: GeoLocation = {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown',
        };

        // Cache in memory (max 1000 items)
        if (localGeoCache.size > 1000) {
          const firstKey = localGeoCache.keys().next().value;
          if (firstKey) localGeoCache.delete(firstKey);
        }
        localGeoCache.set(cleanIp, result);

        // Cache in Redis for 7 days
        if (redis && isRedisReady()) {
          redis.setex(`geo:${cleanIp}`, 7 * 24 * 3600, JSON.stringify(result)).catch(() => {});
        }

        return result;
      }
    }
  } catch (err) {
    // Silent catch on network/timeout error
  }

  const fallback: GeoLocation = { country: 'Unknown', city: 'Unknown' };
  localGeoCache.set(cleanIp, fallback);
  return fallback;
}
