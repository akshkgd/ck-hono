import type { Context } from 'hono';
import { AdminService } from './admin.service.js';
import {
  adminAddUserSchema,
  adminUpdateUserSchema,
  adminUpdateRoleSchema,
  adminUpdateStatusSchema,
  adminSearchQuerySchema
} from './admin.validation.js';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = adminSearchQuerySchema.parse(rawQuery);
      
      const result = await this.adminService.searchUsers(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search users',
      }, 400);
    }
  };

  public add = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = adminAddUserSchema.parse(rawBody);

      const user = await this.adminService.addUser(body);
      return c.json({
        status: 'success',
        message: 'User added successfully',
        data: user,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to add user',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = c.req.param('id')!;
      const rawBody = await c.req.json();
      const body = adminUpdateUserSchema.parse(rawBody);

      const user = await this.adminService.editUser(id, body);
      return c.json({
        status: 'success',
        message: 'User updated successfully',
        data: user,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update user',
      }, 400);
    }
  };

  public changeRole = async (c: Context) => {
    try {
      const id = c.req.param('id')!;
      const rawBody = await c.req.json();
      const body = adminUpdateRoleSchema.parse(rawBody);

      const user = await this.adminService.changeRole(id, body);
      return c.json({
        status: 'success',
        message: 'User role updated successfully',
        data: user,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update user role',
      }, 400);
    }
  };

  public changeStatus = async (c: Context) => {
    try {
      const id = c.req.param('id')!;
      const rawBody = await c.req.json();
      const body = adminUpdateStatusSchema.parse(rawBody);

      const user = await this.adminService.changeStatus(id, body);
      return c.json({
        status: 'success',
        message: 'User status updated successfully',
        data: user,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update user status',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id')!;
      await this.adminService.deleteUser(id);
      
      return c.json({
        status: 'success',
        message: 'User deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete user',
      }, 400);
    }
  };

  public getDetails = async (c: Context) => {
    try {
      const id = c.req.param('id')!;
      const result = await this.adminService.getUserDetails(id);
      
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch user details',
      }, 400);
    }
  };
}
