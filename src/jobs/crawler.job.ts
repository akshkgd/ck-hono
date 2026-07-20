import { CrawlerJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';

export async function processCrawlerJob(data: CrawlerJobData): Promise<Record<string, any>> {
  const startTime = Date.now();
  logger.info(`[CrawlerJob] Starting crawl for URL: ${data.url}`);

  if (!data.url || (!data.url.startsWith('http://') && !data.url.startsWith('https://'))) {
    throw new Error(`Invalid target URL for crawling: ${data.url}`);
  }

  // Perform lightweight HTTP fetch or scraping logic
  const response = await fetch(data.url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Compatible; CK-Hono-Crawler/1.0)',
    },
    signal: AbortSignal.timeout(15000), // 15s request timeout protection
  });

  if (!response.ok) {
    throw new Error(`Crawler request failed with HTTP status ${response.status} for ${data.url}`);
  }

  const htmlText = await response.text();
  const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1].trim() : 'No title found';

  const durationMs = Date.now() - startTime;
  logger.info(`[CrawlerJob] Successfully crawled ${data.url} (Title: "${pageTitle}") in ${durationMs}ms`);

  return {
    url: data.url,
    statusCode: response.status,
    title: pageTitle,
    contentLength: htmlText.length,
    durationMs,
    crawledAt: new Date().toISOString(),
  };
}
