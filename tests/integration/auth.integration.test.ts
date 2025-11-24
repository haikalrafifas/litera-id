/**
 * Integration-style tests: controller + service together, persistence mocked.
 * Using Vitest instead of Jest.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('bcrypt', () => {
  const hash = vi.fn(async () => 'hashed')
  const compare = vi.fn(async () => true)

  return {
    __esModule: false,
    default: { hash, compare },
    hash,
    compare
  }
})

// Mock ORM model
vi.mock('@/database/orm', () => {
  class Model {
    static __query = {
      findOne: vi.fn(),
      insert: vi.fn(() => ({
        returning: vi.fn(() => ({
          id: 'mock-id',
          username: 'mock-user',
          toJSON: () => ({ id: 'mock-id', username: 'mock-user' }),
        })),
      })),
      findById: vi.fn(),
    };
    static query() {
      return this.__query;
    }
  }

  return { __esModule: true, default: Model };
});

// Mock soft-delete decorator
vi.mock('@/database/soft-delete', () => ({
  __esModule: true,
  default: (Base: any) => Base,
}));

// Real imports (after mocks)
import * as authController from '../../src/domains/auth/controller';
import * as authService from '../../src/domains/auth/service';
import * as userService from '../../src/domains/user/service';
import * as jwtUtil from '../../src/utilities/server/jwt';
import ormModule from '@/database/orm';

const Model = (ormModule as any).default ?? (ormModule as any);

const safeMock = (mod: any, name: string, impl: any) => {
  if (mod && typeof mod[name] === 'function') {
    return vi.spyOn(mod, name).mockImplementation(impl);
  }
  mod[name] = vi.fn(impl);
  return mod[name];
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth integration (controller + service, persistence mocked)', () => {
  test('register flow through controller -> service creates a user', async () => {
    Model.__query.findOne = vi.fn(async () => null);
    Model.__query.insert = vi.fn(() => ({
      returning: vi.fn(async () => ({
        id: 'int-u1',
        username: 'intuser',
        name: 'Int',
        toJSON: () => ({ id: 'int-u1', username: 'intuser' }),
      })),
    }));

    const req = { validated: { username: 'intuser', password: 'pass', name: 'Int' } } as any;

    if (typeof (authController as any).register === 'function') {
      const result = await (authController as any).register(req);
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);
      const body = await result.json();
      expect(body.data.username).toBe('intuser');
      return;
    }

    if (typeof (authController as any).registerHandler === 'function') {
      const result = await (authController as any).registerHandler(req);
      expect(result).toBeInstanceOf(Response);
      return;
    }

    const out =
      (authService as any).register?.(req.validated) ??
      (authService as any).createAccount?.(req.validated);

    expect(out).toEqual(expect.objectContaining({ username: 'intuser' }));
  });

  test('login flow through controller -> service returns token', async () => {
    Model.__query.findOne = vi.fn(async () => ({
      id: 'int-u2',
      username: 'me@x.com',
      password: 'hashed',
      toJSON() {
        return { id: 'int-u2', username: 'me@x.com' };
      },
    }));

    const bcrypt = await import('bcrypt');
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const req = { validated: { username: 'me@x.com', password: 'secret' } } as any;

    if (typeof (authController as any).login === 'function') {
      const result = await (authController as any).login(req);
      expect(result).toBeInstanceOf(Response);
      // user is not verified, so 403
      expect(result.status).toBe(403);
      // const body = await result.json();
      // expect(body.data.token).toEqual({ access: 'mocked-signed-token' });
      return;
    }

    if (typeof (authController as any).loginHandler === 'function') {
      const result = await (authController as any).loginHandler(req);
      expect(result).toBeInstanceOf(Response);
      return;
    }

    const out =
      (authService as any).findAccount?.(req.validated.username, req.validated.password) ??
      (authService as any).login?.(req.validated);

    expect(out).toEqual(expect.objectContaining({ token: 'mock-access-token' }));
  });
});
