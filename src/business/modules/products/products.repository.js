import { Product } from "../../entities";
import { NotFoundError } from "../../../share/errors";

export class ProductsRepository {
  construct = data => (new Product({
    name: data.name,
    price: data.price,
    quanlity: data.quanlity,
    description: data.description,
    depositPrice: data.depositPrice,
    shortestHiredDays: data.shortestHiredDays,
    discounts: data.discounts,
    categoryId: data.categoryId,
    location: data.location,
  }));

  insertToDB = data => this.construct(data).save();

  save = data => data.save();

  getById = id => Product.findById(id);

  getByIdOrThrowError = async (id, error = NotFoundError) => {
    const document = await this.getById(id);
    if (!document) throw new error("Not Found Product");
    return document;
  };

  getAll = (
    filter = {
      categoryIds: [],
    },
    options = {
      page: 1,
      limit: 10,
    }
  ) => {
    const conditions = {};
    if (filter && Array.isArray(filter.categoryIds) && filter.categoryIds.length) {
      conditions.categoryId = { $in: filter.categoryIds };
    }
    return Product.paginate(conditions, options);
  };
};