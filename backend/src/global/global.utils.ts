import { PaginationResponse } from './global.interface';

export function buildPagination<T extends { id: string }[]>(
  data: T,
  limit: number,
): PaginationResponse<T> {
  return {
    data,
    limit,
  };
}
