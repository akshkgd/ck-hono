import type { Context } from 'hono';
import { AdminContentLibraryService } from './admin-content-library.service.js';
import {
  createContentLibrarySchema,
  updateContentLibrarySchema,
  contentLibrarySearchQuerySchema
} from '../../content-library/content-library.validation.js';

export class AdminContentLibraryController {
  private adminContentLibraryService: AdminContentLibraryService;

  constructor() {
    this.adminContentLibraryService = new AdminContentLibraryService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = contentLibrarySearchQuerySchema.parse(rawQuery);

      const result = await this.adminContentLibraryService.searchItems(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search content library',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid item ID');
      }

      const item = await this.adminContentLibraryService.getItem(id);
      return c.json({
        status: 'success',
        data: item,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get content library item',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createContentLibrarySchema.parse(rawBody);

      const item = await this.adminContentLibraryService.createItem(body);
      return c.json({
        status: 'success',
        message: 'Content library item created successfully',
        data: item,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create content library item',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid item ID');
      }
      const rawBody = await c.req.json();
      const body = updateContentLibrarySchema.parse(rawBody);

      const item = await this.adminContentLibraryService.updateItem(id, body);
      return c.json({
        status: 'success',
        message: 'Content library item updated successfully',
        data: item,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update content library item',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid item ID');
      }
      await this.adminContentLibraryService.deleteItem(id);
      return c.json({
        status: 'success',
        message: 'Content library item deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete content library item',
      }, 400);
    }
  };
}
