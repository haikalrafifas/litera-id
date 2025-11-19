import Loan from './model';
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
): Promise<PaginatedResult<Loan>> => {
  let baseQuery = Loan.query().whereNull('deleted_at');

  if (userId) {
    baseQuery = baseQuery.where({ user_id: userId });
  }

  return generatePaginatedData<Loan>(baseQuery, params);
};

export const findByUuid = async (
  uuid: string,
): Promise<Loan | undefined> => {
  return await Loan.query().findOne({ uuid }).whereNull('deleted_at');
};

export const create = async (
  payload: Loan,
  userId: string,
): Promise<Loan> => {
  payload.uuid = generateUUID();
  payload.user_id = userId;
  return await Loan.query().insert(payload).returning('*');
};

export const update = async (
  entity: Loan,
  payload: Loan,
): Promise<Loan> => {
  if (payload.qty === 1) payload.qty = entity.qty;

  if (payload.status === 'loaned') {
    payload.loan_date = new Date();
    payload.due_date = new Date(
      Date.now() + DEFAULT_DUE_DAYS * 24 * 60 * 60 * 1000,
    );
  }

  if (payload.status === 'cancelled' || payload.status === 'denied') {
    payload.return_date = null;
  }

  if (payload.status === 'returned') {
    payload.return_date = new Date();
  }

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as Loan;
};

export const destroy = async (
  entity: Loan,
) => {
  await entity.$query().delete();
  return entity;
};
