import { BaseQueryOptions } from "./base-query-options";

export interface PaginateQueryOptions extends BaseQueryOptions {
  page?: number;
}
