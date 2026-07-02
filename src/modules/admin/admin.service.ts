import argon2 from 'argon2';
import { UserRepository, type NewUser } from '../users/user.repository.js';
import { EnrollmentRepository } from '../enrollments/enrollment.repository.js';
import { redis, isRedisReady } from '../../utils/redis.js';
import type {
  AdminAddUserInput,
  AdminUpdateUserInput,
  AdminUpdateRoleInput,
  AdminUpdateStatusInput,
  AdminSearchQueryInput
} from './admin.validation.js';

export class AdminService {
  private userRepository: UserRepository;
  private enrollmentRepository: EnrollmentRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.enrollmentRepository = new EnrollmentRepository();
  }

  public async searchUsers(input: AdminSearchQueryInput) {
    const offset = (input.page - 1) * input.limit;
    const usersList = await this.userRepository.search(
      input.q,
      input.limit,
      offset,
      input.role,
      input.sortBy,
      input.sortOrder
    );
    
    // Omit passwords from search list
    const usersWithoutPassword = usersList.map(({ password, ...user }) => user);

    return {
      users: usersWithoutPassword,
      pagination: {
        page: input.page,
        limit: input.limit,
      }
    };
  }

  public async addUser(input: AdminAddUserInput) {
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
      role: input.role || 'user',
      status: input.status || 'active',
      occupationType: 'other',
      emailVerified: false,
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  public async editUser(id: string, input: AdminUpdateUserInput) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updateData: Partial<NewUser> = { ...input } as any;

    if (input.password) {
      updateData.password = await argon2.hash(input.password);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  public async changeRole(id: string, input: AdminUpdateRoleInput) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.update(id, { role: input.role });
    if (!updatedUser) {
      throw new Error('Failed to update user role');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  public async changeStatus(id: string, input: AdminUpdateStatusInput) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.update(id, { status: input.status });
    if (!updatedUser) {
      throw new Error('Failed to update user status');
    }

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  public async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return this.userRepository.delete(id);
  }

  public async getUserDetails(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;

    // Fetch enrolled courses and progress
    const enrollments = await this.enrollmentRepository.findByUserId(id);

    // Fetch active login sessions from Redis
    const activeSessions: any[] = [];
    if (redis && isRedisReady()) {
      try {
        const sessionKeys = await redis.keys(`session:${id}:*`);
        for (const key of sessionKeys) {
          const sessionDataStr = await redis.get(key);
          if (sessionDataStr) {
            try {
              const sessionData = JSON.parse(sessionDataStr);
              const parts = key.split(':');
              const sessionId = parts[parts.length - 1];
              activeSessions.push({
                sessionId,
                ...sessionData,
              });
            } catch {
              // Ignore invalid json
            }
          }
        }
      } catch (err) {
        console.error('[Redis] Failed to fetch active sessions for user details:', err);
      }
    }

    return {
      user: userWithoutPassword,
      enrollments,
      activeSessions,
    };
  }
}
