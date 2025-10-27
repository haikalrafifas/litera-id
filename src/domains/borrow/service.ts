import Borrow from './model';
import { generateUUID } from '@/utilities/server/string';

export const fetchPaginated = async (
  {
    page = 1,
    limit = 10,
  },
  userId: number,
): Promise<Borrow[]> => {
  const offset = (page - 1) * limit;

  return await Borrow.query()
    .where({ borrowed_by: userId })
    .whereNull('deleted_at')
    .limit(limit)
    .offset(offset)
    .orderBy('created_at', 'desc');
};

export const findByUuid = async (
  uuid: string,
): Promise<Borrow | undefined> => {
  return await Borrow.query().findOne({ uuid }).whereNull('deleted_at');
};

export const create = async (
  payload: Borrow,
  userId: number,
): Promise<Borrow> => {
  payload.uuid = generateUUID();
  payload.borrowed_by = userId;
  return await Borrow.query().insert(payload).returning('*');
};

export const update = async (
  entity: Borrow,
  payload: Borrow,
): Promise<Borrow> => {
  if (payload.qty === 1) payload.qty = entity.qty;

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as Borrow;
};

export const destroy = async (
  entity: Borrow,
) => {
  await entity.$query().delete();
  return entity;
};
