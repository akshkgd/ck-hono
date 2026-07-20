import { UserRepository } from '../users/user.repository.js';
import { auth } from '../../lib/auth.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Request Magic Link via Better Auth API
   */
  public async requestMagicLink(email: string) {
    const api = auth.api as any;
    return api.signInMagicLink({
      body: {
        email: email.toLowerCase().trim(),
      },
    });
  }
}

export const authService = new AuthService();
