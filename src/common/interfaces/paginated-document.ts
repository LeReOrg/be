export interface PaginatedDocument<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
  nextPage?: number | null;
  prevPage?: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
}
