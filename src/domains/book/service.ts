import Book from './model';
import { generateUniqueSlug } from '@/utilities/server/slug';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';

export const fetchPaginated = async ({
  page = 1,
  limit = 10,
}: PaginationInput): Promise<PaginatedResult<Book>> => {
  const offset = (page - 1) * limit;

  const countResult = await Book.query()
    .whereNull('deleted_at')
    .count('id as total')
    .first();

  const total = Number((countResult as any)?.total ?? 0);

  const items = await Book.query()
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
): Promise<Book | undefined> => {
  return await Book.query().findOne({ slug }).whereNull('deleted_at');
};

export const create = async (
  payload: Book,
  creatorId: number,
): Promise<Book> => {
  payload.posted_by = creatorId;
  payload.slug = await generateUniqueSlug(Book, payload.title);
  return await Book.query().insert(payload).returning('*');
};

export const update = async (
  entity: Book,
  payload: Book,
): Promise<Book> => {
  if (payload.title) {
    payload.slug = await generateUniqueSlug(Book, payload.title);
  }

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as Book;
};

export const destroy = async (
  entity: Book,
) => {
  await entity.$query().delete();
  return entity;
};
