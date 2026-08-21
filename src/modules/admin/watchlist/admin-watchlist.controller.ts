import type { Context } from 'hono';
import { AdminWatchlistService } from './admin-watchlist.service.js';
import { addToWatchlistSchema, updateWatchlistSchema, listWatchlistSchema } from './admin-watchlist.validation.js';

export class AdminWatchlistController {
  private service: AdminWatchlistService;

  constructor() {
    this.service = new AdminWatchlistService();
  }

  public list = async (c: Context) => {
    try {
      const query = listWatchlistSchema.parse(c.req.query());
      const data = await this.service.listWatchlist(query);

      return c.json({
        status: 'success',
        data: data.items,
        pagination: data.pagination,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch watchlist',
      }, 400);
    }
  };

  public add = async (c: Context) => {
    try {
      const user = c.get('user');
      const adminUserId = user?.id || '';
      const body = await c.req.json();
      const input = addToWatchlistSchema.parse(body);

      const item = await this.service.addToWatchlist(input, adminUserId);

      return c.json({
        status: 'success',
        message: 'Learner added to watchlist successfully',
        data: item,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to add learner to watchlist',
      }, 400);
    }
  };

  public update = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const body = await c.req.json();
      const input = updateWatchlistSchema.parse(body);

      const item = await this.service.updateWatchlistReason(id, input);

      return c.json({
        status: 'success',
        message: 'Watchlist remark updated successfully',
        data: item,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update watchlist remark',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const item = await this.service.removeFromWatchlist(id);

      return c.json({
        status: 'success',
        message: 'Learner removed from watchlist successfully',
        data: item,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to remove learner from watchlist',
      }, 400);
    }
  };
}
