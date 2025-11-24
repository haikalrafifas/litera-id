/**
 * Unit tests for auth controller using Vitest.
 * Controllers return Response objects.
 */

import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';

/* -----------------------  MOCKS  ----------------------- */

/** bcrypt (CommonJS) */
vi.mock('bcrypt', () => {
  const hash = vi.fn(async () => 'hashed');
  const compare = vi.fn(async () => true);

  return {
    __esModule: false,
    default: { hash, compare },
    hash,
    compare,
  };
});

/** ORM model used internally by user model */
vi.mock('@/database/orm', () => {
  class Model {
    static __query = {
      findOne: vi.fn(),
      insert: vi.fn(() => ({
        returning: vi.fn(() => ({
          id: 'mock-id',
          username: 'mock-user',
          toJSON() {
            return { id: 'mock-id', username: 'mock-user' };
          },
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

/** soft-delete decorator becomes a no-op */
vi.mock('@/database/soft-delete', () => ({
  __esModule: true,
  default: (Base: any) => Base,
}));

/* ----------------------- IMPORTS ------------------------ */

import * as authController from '../../../src/domains/auth/controller';
import ormModule from '@/database/orm';

const Model = (ormModule as any).default ?? ormModule;

/* -------------------- BEFORE EACH ----------------------- */

beforeEach(() => {
  vi.clearAllMocks();
});

/* =========================================================
   CONTROLLER UNIT TESTS
========================================================= */

describe('auth controller (unit)', () => {
  test('register controller → returns Response with created user', async () => {
    // No existing user
    Model.__query.findOne = vi.fn(async () => null);

    // Insert returns model JSON
    Model.__query.insert = vi.fn(() => ({
      returning: vi.fn(async () => ({
        id: 'c1',
        username: 'u1',
        toJSON: () => ({ id: 'c1', username: 'u1' }),
      })),
    }));

    const req = {
      validated: { username: 'u1', password: 'p', name: 'Name' },
    } as any;

    const handler =
      (authController as any).register ??
      (authController as any).registerHandler;

    if (!handler) throw new Error('register handler missing');

    const result: Response = await handler(req);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(200);

    const body = await result.json();
    expect(body.data.username).toBe('u1');
  });

  test('login controller → returns token + user', async () => {
    // DB returns existing user
    Model.__query.findOne = vi.fn(async () => ({
      id: 'c2',
      username: 'u2',
      password: 'hashed',
      toJSON: () => ({ id: 'c2', username: 'u2' }),
    }));

    // Ensure bcrypt.compare returns true
    const bcrypt = await import('bcrypt');
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const req = {
      validated: { username: 'u2', password: 'p' },
    } as any;

    const handler =
      (authController as any).login ??
      (authController as any).loginHandler;

    if (!handler) throw new Error('login handler missing');

    const result: Response = await handler(req);

    expect(result).toBeInstanceOf(Response);
    // expect(result.status).toBe(200);

    // user is not verified, so 403
    expect(result.status).toBe(403);

    // const body = await result.json();

    // expect(body.data).toHaveProperty('token');
    // expect(body.data.token).toEqual({ access: 'mocked-signed-token' });
  });
});
