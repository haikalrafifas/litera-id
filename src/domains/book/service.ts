import Book from './model';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';
import { generatePaginatedData } from '@/utilities/server/pagination';

export const fetchPaginated = async (
  params: PaginationInput,
): Promise<PaginatedResult<Book>> => {
  let baseQuery = Book.query().whereNull('deleted_at');
  
  return generatePaginatedData<Book>(baseQuery, params);
};

export const findByISBN = async (
  isbn: string,
): Promise<Book | undefined> => {
  return await Book.query().findOne({ isbn }).whereNull('deleted_at');
};

export const create = async (
  payload: Book,
): Promise<Book> => {
  return await Book.query().insert(payload).returning('*');
};

export const update = async (
  entity: Book,
  payload: Book,
): Promise<Book> => {
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
