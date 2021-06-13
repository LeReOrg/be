import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Product, ProductDocument } from "./schemas/product.schema";
import { BaseModel } from "../common/interfaces/base-model";
import { FilterQuery } from "mongoose";
import { Category } from "../categories/schemas/category.schema";
import { User } from "../users/schemas/user.schema";

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) private __productModel: BaseModel<ProductDocument>) {
    super(__productModel);
  }

  public async fetchAll(
    filters: {
      cities?: string[];
      rangedPrice?: string;
      isTopProduct?: boolean;
      category?: Category;
      user?: User;
    },
    options: {
      limit?: number;
      page?: number;
      sort?: any;
    },
  ) {
    const conditions: FilterQuery<ProductDocument> = {};

    if (filters) {
      const { cities, rangedPrice, isTopProduct, category, user } = filters;

      if (Array.isArray(cities)) {
        conditions["location.city"] = { $in: cities };
      }
      if (rangedPrice) {
        const [fromPrice, toPrice] = rangedPrice.split("-");
        const fromPriceCondition = fromPrice && { $gte: parseFloat(fromPrice) };
        const toPriceCondition = toPrice && { $lte: parseFloat(toPrice) };
        conditions["price"] = { ...fromPriceCondition, ...toPriceCondition };
      }
      if (typeof isTopProduct === "boolean") {
        conditions["isTopProduct"] = isTopProduct || { $not: { $eq: true } };
      }
      if (category) {
        conditions["category"] = category;
      }
      if (user) {
        conditions["user"] = user;
      }
    }

    return this.__productModel.paginate(conditions, {
      ...options,
      projection: {
        images: { $slice: 1 },
      },
    });
  }

  public async findProductDetailById(id: string): Promise<Product> {
    const doc = await this.__productModel.findById(id).populate("category").populate("user");

    if (!doc) {
      throw new NotFoundException("Not Found Product");
    }

    return doc;
  }
}
