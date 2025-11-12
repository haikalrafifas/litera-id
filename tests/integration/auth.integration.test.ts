/**
 * Integration-style tests: controller + service together, persistence mocked.
 * Controllers return Response objects; findAccount returns User, authenticate provides token.
 */
import { jest } from '@jest/globals';

// Mock bcrypt globally
jest.mock('bcrypt', () => ({
  hash: jest.fn(async () => 'hashed'),
  compare: jest.fn(async () => true)
}));

// Removed jest.mock for JWT; using __mocks__/jwtMock.ts

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
import * as userService from '../../src/domains/user/service';
import * as jwtUtil from '../../src/utilities/server/jwt';
import ormModule from '@/database/orm';

const Model = (ormModule as any).default ?? (ormModule as any);

const safeMock = (mod: any, name: string, impl: any) => {
  if (mod && typeof (mod as any)[name] === 'function') {
    return jest.spyOn(mod as any, name).mockImplementation(impl);
  }
  (mod as any)[name] = jest.fn(impl);
  return (mod as any)[name];
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth integration (controller + service, persistence mocked)', () => {
  test('register flow through controller -> service creates a user', async () => {
    // Ensure User.query().findOne returns null (no existing)
    Model.__query.findOne = jest.fn(async () => null);
    Model.__query.insert = jest.fn(() => ({
      returning: jest.fn(async () => ({ id: 'int-u1', username: 'intuser', name: 'Int', toJSON: () => ({ id: 'int-u1', username: 'intuser' }) }))
    }));

    const req = { validated: { username: 'intuser', password: 'pass', name: 'Int' } } as any;

    if (typeof (authController as any).register === 'function') {
      const result = await (authController as any).register(req);
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);  // ApiResponse.success returns 200
      const body = await result.json();
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('username', 'intuser');
      return;
    }

    if (typeof (authController as any).registerHandler === 'function') {
      const result = await (authController as any).registerHandler(req);
      expect(result).toBeInstanceOf(Response);
      return;
    }

    const out = await (authService as any).register?.(req.validated);
    expect(out).toEqual(expect.objectContaining({ username: 'intuser' }));
  });

  test('login flow through controller -> service returns token', async () => {
    Model.__query.findOne = jest.fn(async () => ({ id: 'int-u2', username: 'me@x.com', password: 'hashed', toJSON() { return { id: 'int-u2', username: 'me@x.com' }; } }));
    const bcrypt = require('bcrypt');
    bcrypt.compare.mockResolvedValue(true);

    const req = { validated: { username: 'me@x.com', password: 'secret' } } as any;

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

    const out = await (authService as any).findAccount?.(req.validated.username, req.validated.password)
      ?? (authService as any).login?.(req.validated);
    expect(out).toEqual(expect.objectContaining({ token: 'mock-access-token' }));
  });
});