import ApiResponse from '@/utilities/server/response';
import * as bookService from './service';

export const index = async (req: Request) => {
  const { page, limit } = (req as any).validated;

  const { data, pagination } = await bookService
    .fetchPaginated({ page, limit });

  return ApiResponse.success(
    'Successfully get books!',
    data,
    pagination,
  );
};

export const show = async (req: Request) => {
  const isbn = (req as any).validated['isbn'];

  const data = await bookService.findByISBN(isbn);
  if (!data) {
    return ApiResponse.error(404, 'Book not found');
  }

  return ApiResponse.success(
    'Successfully get book by slug!',
    data.toJSON(),
  );
};

export const create = async (req: Request) => {
  const payload = (req as any).validated;
  
  const newRecord = await bookService.create(payload);

  return ApiResponse.success(
    'Successfully created new book!',
    newRecord.toJSON(),
  );
};

export const update = async (req: Request) => {
  const payload = (req as any).validated;
  const isbn = payload.isbn;

  const data = await bookService.findByISBN(isbn);
  if (!data) {
    return ApiResponse.error(404, 'Book not found');
  }

  const updated = await bookService.update(data, payload);

  return ApiResponse.success(
    'Successfully updated book by slug!',
    updated.toJSON(),
  );
};

export const destroy = async (req: Request) => {
  const payload = (req as any).validated;
  const isbn = payload.isbn;

  const data = await bookService.findByISBN(isbn);
  if (!data) {
    return ApiResponse.error(404, 'Book not found');
  }

  const deleted = await bookService.destroy(data);

  return ApiResponse.success(
    'Successfully deleted book by slug!',
    deleted.toJSON(),
  );
};
