export type PaginationResponse<T> = {
  data: T;
  limit: number;
  pages: number;
};
