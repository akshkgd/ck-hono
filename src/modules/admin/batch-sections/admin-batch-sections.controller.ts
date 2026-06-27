import type { Context } from 'hono';
import { AdminBatchSectionsService } from './admin-batch-sections.service.js';
import {
  createBatchSectionSchema,
  updateBatchSectionSchema,
  batchSectionSearchQuerySchema
} from '../../batches/batch-section.validation.js';

export class AdminBatchSectionsController {
  private adminBatchSectionsService: AdminBatchSectionsService;

  constructor() {
    this.adminBatchSectionsService = new AdminBatchSectionsService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = batchSectionSearchQuerySchema.parse(rawQuery);

      const result = await this.adminBatchSectionsService.searchSections(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search batch sections',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid section ID');
      }

      const section = await this.adminBatchSectionsService.getSection(id);
      return c.json({
        status: 'success',
        data: section,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get batch section',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createBatchSectionSchema.parse(rawBody);

      const section = await this.adminBatchSectionsService.createSection(body);
      return c.json({
        status: 'success',
        message: 'Batch section created successfully',
        data: section,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create batch section',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid section ID');
      }
      const rawBody = await c.req.json();
      const body = updateBatchSectionSchema.parse(rawBody);

      const section = await this.adminBatchSectionsService.updateSection(id, body);
      return c.json({
        status: 'success',
        message: 'Batch section updated successfully',
        data: section,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update batch section',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid section ID');
      }
      await this.adminBatchSectionsService.deleteSection(id);
      return c.json({
        status: 'success',
        message: 'Batch section deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete batch section',
      }, 400);
    }
  };
}
