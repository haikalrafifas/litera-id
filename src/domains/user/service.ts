import User from './model';
import type {
  PaginationInput,
  PaginatedResult,
} from '@/interfaces/pagination';
import * as filesystem from '@/utilities/server/filesystem';
import { generatePaginatedData } from '@/utilities/server/pagination';

export const fetchPaginated = async (
  params: PaginationInput,
  ): Promise<PaginatedResult<User>> => {
  const baseQuery = User.query()
    .whereNull('deleted_at')
    .whereNot({ role: 'admin' });

  return generatePaginatedData<User>(baseQuery, params);
};

export const findById = async (
  userId: number,
): Promise<User | undefined> => {
  return await User.query().findById(userId).whereNull('deleted_at');
};

export const findByUsername = async (
  username: string,
): Promise<User | undefined> => {
  return await User.query().findOne({ username });
};

export const update = async (
  entity: User,
  payload: User,
): Promise<User> => {
  if (payload.image) {
    const blob = payload.image as unknown as File;
    payload.image = await filesystem.update(entity.image, blob, 'users');
  }

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as User;
};
