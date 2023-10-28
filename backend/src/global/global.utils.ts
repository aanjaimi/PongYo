import { PaginationResponse } from './global.interface';

export function buildPagination<T>(
  data: T,
  limit: number,
  totalCount: number,
): PaginationResponse<T> {
  return {
    data,
    pages: Math.ceil(totalCount / limit),
    limit,
  };
}
