import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import {
  Document,
  FilterQuery,
  InsertManyOptions,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";
import { BaseModel } from "../interfaces/base-model";
import { BaseQueryOptions } from "../interfaces/base-query-options";
import { PaginatedDocument } from "../interfaces/paginated-document";
import { PaginateQueryOptions } from "../interfaces/paginate-query-options";

export class BaseRepository<T extends Document> {
  constructor(private readonly __model: BaseModel<T>) {}

  public async paginate(
    query: FilterQuery<T> = {},
    options?: PaginateQueryOptions | null,
  ): Promise<PaginatedDocument<T>> {
    return this.__model.paginate(query, options);
  }

  public async findAll(
    filter: FilterQuery<T> = {},
    projection?: any | null,
    options?: BaseQueryOptions | null,
  ): Promise<T[]> {
    return this.__model.find(filter, projection, options);
  }

  public async findOne(
    filter: FilterQuery<T>,
    projection?: any | null,
    options?: QueryOptions | null,
  ): Promise<T | null> {
    return this.__model.findOne(filter, projection, options);
  }

  public async findById(
    id: any,
    projection?: any | null,
    options?: QueryOptions | null,
  ): Promise<T | null> {
    return this.__model.findById(id, projection, options);
  }

  public async createOne(doc: Partial<T>, options?: SaveOptions): Promise<T> {
    const createdDocument = new this.__model(doc);
    return createdDocument.save(options);
  }

  public async updateOne(
    filter: FilterQuery<T>,
    update: UpdateWithAggregationPipeline | UpdateQuery<T> | undefined,
    options?: QueryOptions | null | undefined,
  ): Promise<void> {
    const raw = await this.__model.updateOne(filter, update, options);

    // TODO: Should ok = 1 and nModified = 0 consider as fail?
    if (raw.ok === 0 || raw.nModified !== 1) {
      throw new InternalServerErrorException("Update failed");
    }
  }

  public async upsertOne(
    filter: FilterQuery<T>,
    update: UpdateWithAggregationPipeline | UpdateQuery<T> | undefined,
    options?: QueryOptions | null | undefined,
  ): Promise<T | null> {
    const defaultOptions: QueryOptions = {
      new: true,
      upsert: true,
      useFindAndModify: false,
    };

    return this.__model.findOneAndUpdate(filter, update, { ...defaultOptions, ...options });
  }

  public async findByIdOrThrowException(
    id: any,
    projection?: any | null,
    options?: BaseQueryOptions | null,
  ): Promise<T> {
    const document = await this.__model.findById(id, projection, options);

    if (!document) {
      throw new NotFoundException("Not found " + this.__model.modelName);
    }

    return document;
  }

  public async findByIdAndUpdate(
    id: any,
    update: UpdateWithAggregationPipeline | UpdateQuery<T> | undefined,
    options?: QueryOptions | null | undefined,
  ): Promise<T> {
    const document = await this.__model.findByIdAndUpdate(id, update, {
      useFindAndModify: false,
      new: true,
      ...options,
    });

    if (!document) {
      throw new NotFoundException("Not found " + this.__model.modelName);
    }

    return document;
  }

  public async createMany(docs: Partial<T>[], options?: InsertManyOptions) {
    return this.__model.insertMany(docs, options);
  }
}