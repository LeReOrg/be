import { QueryOptions } from "mongoose";

export interface BaseQueryOptions extends QueryOptions {
  populate?: any;
}
