import Inventory from './model';
import { generateUUID } from '@/utilities/server/string';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';

export const fetchPaginated = async ({
  page = 1,
  limit = 10,
}: PaginationInput): Promise<PaginatedResult<Inventory>> => {
  const offset = (page - 1) * limit;

  const countResult = await Inventory.query()
    .whereNull('deleted_at')
    .count('id as total')
    .first();

  const total = Number((countResult as any)?.total ?? 0);

  const items = await Inventory.query()
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

export const findByUuid = async (
  uuid: string,
): Promise<Inventory | undefined> => {
  return await Inventory.query().findOne({ uuid }).whereNull('deleted_at');
};

export const create = async (
  payload: Inventory,
): Promise<Inventory> => {
  payload.uuid = generateUUID();
  return await Inventory.query().insert(payload).returning('*');
};

export const update = async (
  entity: Inventory,
  payload: Inventory,
): Promise<Inventory> => {
  if (payload.qty === 1) payload.qty = entity.qty;

  return await entity.$query()
    .patch({ ...payload })
    .returning('*')
    .first() as Inventory;
};

export const destroy = async (
  entity: Inventory,
) => {
  await entity.$query().delete();
  return entity;
};
