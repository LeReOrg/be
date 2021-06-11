import { Model, QueryOptions, FilterQuery } from "mongoose";
import { PaginatedDocument } from "./paginated-document";

export interface BaseModel<T> extends Model<T> {
  paginate(query: FilterQuery<T>, options?: QueryOptions | null): Promise<PaginatedDocument<T>>;
}
