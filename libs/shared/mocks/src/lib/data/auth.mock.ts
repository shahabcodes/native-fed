import { User, LoginCredentials, LoginResponse } from '@mfe-workspace/shared-services';

export interface MockUser {
  email: string;
  password: string;
  user: Omit<User, 'createdAt' | 'updatedAt'>;
}

export const MOCK_USERS: MockUser[] = [
  {
    email: 'admin@example.com',
    password: 'password',
    user: {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  },
  {
    email: 'inspector@example.com',
    password: 'password',
    user: {
      id: '2',
      email: 'inspector@example.com',
      firstName: 'John',
      lastName: 'Inspector',
      role: 'inspector',
    },
  },
];

export function findMockUser(credentials: LoginCredentials): MockUser | undefined {
  return MOCK_USERS.find(
    u => u.email === credentials.email && u.password === credentials.password
  );
}

export function createMockLoginResponse(mockUser: MockUser): LoginResponse {
  const now = new Date().toISOString();
  return {
    user: {
      ...mockUser.user,
      createdAt: now,
      updatedAt: now,
    },
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: 3600,
  };
}
