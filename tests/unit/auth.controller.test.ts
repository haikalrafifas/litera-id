/**
 * Unit tests for auth controller.
 * Controllers return Response objects; findAccount returns User, authenticate provides token.
 */
import { jest } from '@jest/globals';

// Mock bcrypt globally
jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true)
}));

// Removed jest.mock for JWT; using __mocks__/jwtMock.ts

// provide Model mock used by domain models
jest.mock('@/database/orm', () => {
  class Model {
    static __query = {
      findOne: jest.fn(),
      insert: jest.fn(() => ({
        returning: jest.fn(() => ({ id: 'mock-id', username: 'mock-user', toJSON: () => ({ id: 'mock-id', username: 'mock-user' }) }))
      })),
      findById: jest.fn()
    };
    static query() { return this.__query; }
  }
  return { __esModule: true, default: Model };
});
jest.mock('@/database/soft-delete', () => ({ __esModule: true, default: (Base: any) => Base }));

import * as authController from '../../src/domains/auth/controller';
import * as authService from '../../src/domains/auth/service';
import ormModule from '@/database/orm';

const Model = (ormModule as any).default ?? (ormModule as any);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth controller (unit)', () => {
  test('register controller returns Response with created user', async () => {
    // Mock service/DB responses
    Model.__query.findOne = jest.fn(async () => null);  // no existing user
    Model.__query.insert = jest.fn(() => ({
      returning: jest.fn(async () => ({ id: 'c1', username: 'u1', toJSON: () => ({ id: 'c1', username: 'u1' }) }))
    }));

    const req = { validated: { username: 'u1', password: 'p', name: 'Name' } } as any;

    if (typeof (authController as any).register === 'function') {
      const result = await (authController as any).register(req);
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);  // ApiResponse.success returns 200
      const body = await result.json();
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('username', 'u1');
      return;
    }

    if (typeof (authController as any).registerHandler === 'function') {
      const result = await (authController as any).registerHandler(req);
      expect(result).toBeInstanceOf(Response);
      return;
    }

    throw new Error('Adjust test: register handler not found on auth controller');
  });

  test('login controller returns Response with token + user', async () => {
    // Mock DB/service responses
    Model.__query.findOne = jest.fn(async () => ({ id: 'c2', username: 'u2', password: 'hashed', toJSON: () => ({ id: 'c2', username: 'u2' }) }));
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValue(true);

    const req = { validated: { username: 'u2', password: 'p' } } as any;

    if (typeof (authController as any).login === 'function') {
      const result = await (authController as any).login(req);
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('token', { access: 'mocked-signed-token' });
      return;
    }

    if (typeof (authController as any).loginHandler === 'function') {
      const result = await (authController as any).loginHandler(req);
      expect(result).toBeInstanceOf(Response);
      return;
    }

    throw new Error('Adjust test: login handler not found on auth controller');
  });
});