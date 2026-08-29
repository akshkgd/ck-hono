import type { Context } from 'hono';
import { PublicUsersService } from './public-users.service.js';

export class PublicUsersController {
  private service = new PublicUsersService();

  public getProfileByEmail = async (c: Context) => {
    try {
      const { email } = (c.req as any).valid('query');
      const userProfile = await this.service.getActiveUserProfileByEmail(email);

      return c.json({
        status: 'success',
        data: userProfile,
      }, 200);
    } catch (err: any) {
      if (err.message === 'User not found') {
        return c.json({
          status: 'error',
          message: 'User not found',
        }, 404);
      }

      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch user profile',
      }, 400);
    }
  };
}
