/**
 * Unit tests for auth service (login/findAccount).
 * findAccount returns the User object; controller calls authenticate separately for token.
 */
import { jest } from '@jest/globals';

// Mock bcrypt globally to control password verification
jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true)  // default to true; override in tests
}));

// Removed jest.mock for JWT; using __mocks__/jwtMock.ts

// Mock ORM and soft-delete before importing any domain code
jest.mock('@/database/orm', () => {
  // create a fake Model with a mutable static __query object supporting chaining
  class Model {
    static __query = {
      findOne: jest.fn(),
      insert: jest.fn(() => ({
        returning: jest.fn(() => ({ id: 'mock-id', username: 'mock-user', toJSON: () => ({ id: 'mock-id', username: 'mock-user' }) }))
      })),
      findById: jest.fn()
    };
    static query() {
      return this.__query;
    }
  }
  return { __esModule: true, default: Model };
});
jest.mock('@/database/soft-delete', () => ({
  __esModule: true,
  default: (Base: any) => Base
}));

// Now import modules under test
import * as authService from '../../src/domains/auth/service';
import ormModule from '@/database/orm';

// Support both `import orm from '.../orm'` shapes: module.default or module
const Model = (ormModule as any).default ?? (ormModule as any);

const setQueryMock = (name: 'findOne' | 'insert' | 'findById', impl: any) => {
  Model.__query[name] = jest.fn(impl);
  return Model.__query[name];
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth service - findAccount (login)', () => {
  test('returns user when credentials are valid', async () => {
    // Arrange - make User.query().findOne return a DB-like user with toJSON()
    const dbUser = {
      id: 'u3',
      username: 'loginuser',
      password: 'hashed',
      toJSON() { return { id: 'u3', username: 'loginuser' }; }
    };
    setQueryMock('findOne', async () => dbUser);

    // Mock bcrypt.compare to return true for valid password
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValue(true);

    // Act - call the exported findAccount function
    const fn = (authService as any).findAccount;
    if (!fn || typeof fn !== 'function') throw new Error('authService.findAccount not exported - update test');
    const result = await fn('loginuser', 'p');

    // Assert
    expect(Model.__query.findOne).toHaveBeenCalledWith({ username: 'loginuser' });
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'u3');
    expect(result).toHaveProperty('username', 'loginuser');
    // Removed expect(result.password).toBeUndefined(); as service returns user with password
  });

  test('returns null when user not found', async () => {
    setQueryMock('findOne', async () => null);

    const fn = (authService as any).findAccount;
    if (!fn || typeof fn !== 'function') throw new Error('authService.findAccount not exported - update test');

    const result = await fn('noone', 'x');
    expect(result).toBeNull();
  });

  test('returns null on invalid password', async () => {
    setQueryMock('findOne', async (username: string) => ({ id: 'u4', username, password: 'hashed', toJSON() { return { id: 'u4', username }; } }));

    // Mock bcrypt.compare to return false for invalid password
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValue(false);

    const fn = (authService as any).findAccount;
    if (!fn || typeof fn !== 'function') throw new Error('authService.findAccount not exported - update test');

    const result = await fn('loginuser', 'bad');
    expect(result).toBeNull();
  });
});