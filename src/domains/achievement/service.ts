import Achievement from './model';
import { generateUniqueSlug } from '@/utilities/server/slug';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';

export const fetchPaginated = async ({
  page = 1,
  limit = 10,
}: PaginationInput): Promise<PaginatedResult<Achievement>> => {
  const offset = (page - 1) * limit;

  const countResult = await Achievement.query()
    .whereNull('deleted_at')
    .count('id as total')
    .first();

  const total = Number((countResult as any)?.total ?? 0);

  const items = await Achievement.query()
    .whereNull('deleted_at')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: items,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const findBySlug = async (
  slug: string,
): Promise<Achievement | undefined> => {
  return await Achievement.query().findOne({ slug }).whereNull('deleted_at');
};

export const create = async (
  payload: Achievement,
  creatorId: number,
): Promise<Achievement> => {
  payload.posted_by = creatorId;
  payload.slug = await generateUniqueSlug(Achievement, payload.title);
  return await Achievement.query().insert(payload).returning('*');
};

export const update = async (
  entity: Achievement,
  payload: Achievement,
): Promise<Achievement> => {
  if (payload.title) {
    payload.slug = await generateUniqueSlug(Achievement, payload.title);
  }

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as Achievement;
};

export const destroy = async (
  entity: Achievement,
) => {
  await entity.$query().delete();
  return entity;
};
