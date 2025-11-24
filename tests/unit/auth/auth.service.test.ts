/**
 * Unit tests for auth service using Vitest.
 * Tests findAccount() behavior for valid, missing, and invalid users.
 */

import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';

/* ------------------------- MOCKS ------------------------- */

/** Mock bcrypt (CommonJS style) */
vi.mock('bcrypt', () => {
  const hash = vi.fn(async () => 'hashed');
  const compare = vi.fn(async () => true); // override per test

  return {
    __esModule: false,
    default: { hash, compare },
    hash,
    compare,
  };
});

/** Mock ORM model used internally */
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

/** soft-delete → no-op */
vi.mock('@/database/soft-delete', () => ({
  __esModule: true,
  default: (Base: any) => Base,
}));

/* -------------------- IMPORT MODULE UNDER TEST -------------------- */

import * as authService from '../../../src/domains/auth/service';
import ormModule from '@/database/orm';

const Model = (ormModule as any).default ?? ormModule;

const setQueryMock = (
  name: 'findOne' | 'insert' | 'findById',
  impl: any,
) => {
  Model.__query[name] = vi.fn(impl);
  return Model.__query[name];
};

/* ------------------------- BEFORE EACH ------------------------- */

beforeEach(() => {
  vi.clearAllMocks();
});

/* ==========================================================
   AUTH SERVICE — findAccount()
========================================================== */

describe('auth service - findAccount', () => {
  test('returns user when credentials are valid', async () => {
    const dbUser = {
      id: 'u3',
      username: 'loginuser',
      password: 'hashed',
      toJSON() {
        return { id: 'u3', username: 'loginuser' };
      },
    };

    setQueryMock('findOne', async () => dbUser);

    const bcrypt = await import('bcrypt');
    (bcrypt.compare as Mock).mockResolvedValue(true);

    const fn = (authService as any).findAccount;
    if (typeof fn !== 'function') throw new Error('findAccount missing');

    const result = await fn('loginuser', 'p');

    expect(Model.__query.findOne).toHaveBeenCalledWith({
      username: 'loginuser',
    });
    expect(bcrypt.compare).toHaveBeenCalled();

    expect(result).toMatchObject({
      id: 'u3',
      username: 'loginuser',
    });
  });

  test('returns null when user not found', async () => {
    setQueryMock('findOne', async () => null);

    const fn = (authService as any).findAccount;
    if (typeof fn !== 'function') throw new Error('findAccount missing');

    const result = await fn('noone', 'x');
    expect(result).toBeNull();
  });

  test('returns null when password invalid', async () => {
    setQueryMock('findOne', async (username: string) => ({
      id: 'u4',
      username,
      password: 'hashed',
      toJSON() {
        return { id: 'u4', username };
      },
    }));

    const bcrypt = await import('bcrypt');
    (bcrypt.compare as Mock).mockResolvedValue(false);

    const fn = (authService as any).findAccount;
    if (typeof fn !== 'function') throw new Error('findAccount missing');

    const result = await fn('loginuser', 'bad');

    expect(result).toBeNull();
  });
});
