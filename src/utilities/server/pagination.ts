import type { QueryBuilder } from 'objection';
import type {
  PaginatedResult,
  PaginationInput,
} from '@/interfaces/pagination';

export const generatePaginatedData = async <T>(
  baseQuery: QueryBuilder<any, T[]>,
  {
    page = 1,
    limit = 10,
  }: PaginationInput,
): Promise<PaginatedResult<T>> => {
  const offset = (page - 1) * limit;

  const countResult = await baseQuery.clone()
    .count('id as total')
    .first();
  
  const total = Number((countResult as any)?.total ?? 0);

  const items = await baseQuery.clone()
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
