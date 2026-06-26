import argon2 from 'argon2';
import { sign } from 'hono/jwt';
import { UserRepository } from '../users/user.repository.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(input: LoginInput, jwtSecret: string) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password, input.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days expiration
    };

    const token = await sign(payload, jwtSecret, 'HS256');

    // Omit password from user response
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  public async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await argon2.hash(input.password);

    const newUser = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name || null,
      mobile: input.mobile || null,
      occupationType: 'other',
      role: 'user',
      status: 'active',
      emailVerified: false,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
}
