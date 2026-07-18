import type { Context } from 'hono';
import { BatchRepository } from './batch.repository.js';

export class PublicBatchesController {
  private batchRepository: BatchRepository;

  constructor() {
    this.batchRepository = new BatchRepository();
  }

  public getBatchById = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'), 10);
      if (isNaN(id)) {
        return c.json({ status: 'error', message: 'Invalid batch ID' }, 400);
      }

      const batch = await this.batchRepository.findById(id);
      if (!batch) {
        return c.json({ status: 'error', message: 'Batch not found' }, 404);
      }

      return c.json({
        status: 'success',
        data: {
          id: batch.id,
          name: batch.name,
          price: batch.price,
          topic: batch.topic,
          description: batch.description,
          slug: batch.slug,
          img: batch.img,
        },
      }, 200);
    } catch (err: any) {
      return c.json({ status: 'error', message: err.message }, 400);
    }
  };

  public getBatchBySlug = async (c: Context) => {
    try {
      const slug = c.req.param('slug');
      if (!slug) {
        return c.json({ status: 'error', message: 'Invalid batch slug' }, 400);
      }

      const batch = await this.batchRepository.findBySlug(slug);
      if (!batch) {
        return c.json({ status: 'error', message: 'Batch not found' }, 404);
      }

      return c.json({
        status: 'success',
        data: {
          id: batch.id,
          name: batch.name,
          price: batch.price,
          topic: batch.topic,
          description: batch.description,
          slug: batch.slug,
          img: batch.img,
        },
      }, 200);
    } catch (err: any) {
      return c.json({ status: 'error', message: err.message }, 400);
    }
  };
}
