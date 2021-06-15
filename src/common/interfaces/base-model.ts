import { Model, FilterQuery } from "mongoose";
import { PaginatedDocument } from "./paginated-document";
import { PaginateQueryOptions } from "./paginate-query-options";

export interface BaseModel<T> extends Model<T> {
  paginate(
    query: FilterQuery<T>,
    options?: PaginateQueryOptions | null,
  ): Promise<PaginatedDocument<T>>;
}
