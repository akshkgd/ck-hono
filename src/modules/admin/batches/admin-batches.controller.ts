import type { Context } from 'hono';
import { AdminBatchesService } from './admin-batches.service.js';
import {
  createBatchSchema,
  updateBatchSchema,
  batchSearchQuerySchema
} from '../../batches/batch.validation.js';

export class AdminBatchesController {
  private adminBatchesService: AdminBatchesService;

  constructor() {
    this.adminBatchesService = new AdminBatchesService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = batchSearchQuerySchema.parse(rawQuery);
      
      const result = await this.adminBatchesService.searchBatches(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search batches',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid batch ID');
      }

      const batch = await this.adminBatchesService.getBatch(id);
      return c.json({
        status: 'success',
        data: batch,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get batch',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createBatchSchema.parse(rawBody);

      const batch = await this.adminBatchesService.createBatch(body);
      return c.json({
        status: 'success',
        message: 'Batch created successfully',
        data: batch,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create batch',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid batch ID');
      }
      const rawBody = await c.req.json();
      const body = updateBatchSchema.parse(rawBody);

      const batch = await this.adminBatchesService.updateBatch(id, body);
      return c.json({
        status: 'success',
        message: 'Batch updated successfully',
        data: batch,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update batch',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid batch ID');
      }
      await this.adminBatchesService.deleteBatch(id);
      return c.json({
        status: 'success',
        message: 'Batch deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete batch',
      }, 400);
    }
  };
}
