import type { Context } from 'hono';
import { AdminBatchContentService } from './admin-batch-content.service.js';
import {
  createBatchContentSchema,
  updateBatchContentSchema,
  batchContentSearchQuerySchema,
  batchContentReorderSchema
} from '../../batch-content/batch-content.validation.js';

export class AdminBatchContentController {
  private adminBatchContentService: AdminBatchContentService;

  constructor() {
    this.adminBatchContentService = new AdminBatchContentService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = batchContentSearchQuerySchema.parse(rawQuery);

      const result = await this.adminBatchContentService.searchBatchContents(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search batch contents',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid ID');
      }

      const record = await this.adminBatchContentService.getBatchContent(id);
      return c.json({
        status: 'success',
        data: record,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get batch content linkage',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createBatchContentSchema.parse(rawBody);

      const record = await this.adminBatchContentService.createBatchContent(body);
      return c.json({
        status: 'success',
        message: 'Batch content associated successfully',
        data: record,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to associate batch content',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid ID');
      }
      const rawBody = await c.req.json();
      const body = updateBatchContentSchema.parse(rawBody);

      const record = await this.adminBatchContentService.updateBatchContent(id, body);
      return c.json({
        status: 'success',
        message: 'Batch content linkage updated successfully',
        data: record,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update batch content linkage',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid ID');
      }
      await this.adminBatchContentService.deleteBatchContent(id);
      return c.json({
        status: 'success',
        message: 'Batch content linkage deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete batch content linkage',
      }, 400);
    }
  };

  public reorder = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = batchContentReorderSchema.parse(rawBody);

      await this.adminBatchContentService.reorderBatchContents(body.orders);
      return c.json({
        status: 'success',
        message: 'Batch contents reordered successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to reorder batch contents',
      }, 400);
    }
  };
}
