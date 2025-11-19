import Loan from './model';
import Book from '../book/model';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';
import { generateUUID } from '@/utilities/server/string';
import { generatePaginatedData } from '@/utilities/server/pagination';

const DEFAULT_DUE_DAYS = 14;

export const fetchPaginated = async (
  params: PaginationInput,
  userId?: number,
  status?: string,
): Promise<PaginatedResult<Loan>> => {
  let baseQuery = Loan.query()
    .whereNull('loans.deleted_at')
    .withGraphFetched('[book, user]')
    .modifyGraph('book', (builder) => {
      builder.whereNull('deleted_at');
    })
    .modifyGraph('user', (builder) => {
      builder.whereNull('deleted_at');
    });

  if (userId) {
    baseQuery = baseQuery.where({ user_id: userId });
  }

  if (status) {
    baseQuery = baseQuery.where({ status });
  }

  return generatePaginatedData<Loan>(baseQuery, params);
};

export const findByUuid = async (
  uuid: string,
): Promise<Loan | undefined> => {
  return await Loan.query()
    .findOne({ uuid })
    .whereNull('deleted_at')
    .withGraphFetched('[book, user]');
};

export const create = async (
  payload: any,
  userId: number,
): Promise<Loan> => {
  // Find book by ISBN and validate stock
  const book = await Book.query()
    .findOne({ isbn: payload.book_isbn })
    .whereNull('deleted_at');

  if (!book) {
    throw new Error('Book not found');
  }

  if (book.stock < payload.qty) {
    throw new Error('Insufficient book stock');
  }

  const loanData: any = {
    uuid: generateUUID(),
    user_id: userId,
    book_id: book.id,
    qty: payload.qty,
    notes: payload.notes,
    status: 'requested',
    loan_date: null,
    due_date: null,
  };

  return await Loan.query().insert(loanData).returning('*');
};

export const update = async (
  entity: Loan,
  payload: any,
): Promise<Loan> => {
  const updateData: any = {};

  // Handle status transitions
  if (payload.status && payload.status !== entity.status) {
    updateData.status = payload.status;

    // Get the book for stock management
    const book = await Book.query().findById(entity.book_id);
    if (!book) {
      throw new Error('Book not found');
    }

    // When approving, just set status to approved
    if (payload.status === 'approved' && entity.status === 'requested') {
      // Status will be set above
    }

    // When loaning out (admin gives the book), reduce stock
    if (payload.status === 'loaned' && entity.status === 'approved') {
      if (book.stock < entity.qty) {
        throw new Error('Insufficient book stock');
      }
      updateData.loan_date = new Date();
      updateData.due_date = new Date(
        Date.now() + DEFAULT_DUE_DAYS * 24 * 60 * 60 * 1000,
      );
      // Reduce stock
      await book.$query().patch({ stock: book.stock - entity.qty });
    }

    // When returning, restore stock
    if (payload.status === 'returned' && 
        (entity.status === 'loaned' || entity.status === 'overdue')) {
      updateData.return_date = new Date();
      // Restore stock
      await book.$query().patch({ stock: book.stock + entity.qty });
    }

    // When denying or cancelling from requested, no stock change needed
    if ((payload.status === 'denied' || payload.status === 'cancelled') && 
        entity.status === 'requested') {
      updateData.loan_date = null;
      updateData.due_date = null;
      updateData.return_date = null;
    }
  }

  if (payload.notes !== undefined) {
    updateData.notes = payload.notes;
  }

  return await entity.$query()
    .patch(updateData)
    .returning('*')
    .first() as Loan;
};

export const destroy = async (
  entity: Loan,
) => {
  await entity.$query().delete();
  return entity;
};
