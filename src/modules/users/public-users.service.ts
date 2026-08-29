import { UserRepository } from './user.repository.js';

export class PublicUsersService {
  private repository = new UserRepository();

  public async getActiveUserProfileByEmail(email: string) {
    const user = await this.repository.findActiveByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
  }
}
