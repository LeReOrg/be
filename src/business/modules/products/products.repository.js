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
    isTopProduct: data.isTopProduct,
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

  get = (
    filter = {
      categoryIds: [],
      cities: [], // ["District 1", "District 2"]
      // fromPrice: 10
      // toPrice: 20
    },
    options = {
      page: 1,
      limit: 10,
      // sort: {price: "asc", quanlity: "desc"},
    }
  ) => {
    const conditions = {};

    if (filter) {
      const { categoryIds, cities, fromPrice, toPrice } = filter;

      if (Array.isArray(categoryIds) && categoryIds.length) {
        conditions["categoryId"] = { $in: categoryIds };
      }
      if (Array.isArray(cities) && cities.length) {
        conditions["location.city"] = { $in: cities };
      }
      if (fromPrice || toPrice) {
        const fromPriceCondition = fromPrice && { $gte: fromPrice };
        const toPriceCondition = toPrice && { $lte: toPrice };
        conditions["price"] = { ...fromPriceCondition, ...toPriceCondition };
      }
    }

    return Product.paginate(conditions, options);
  };
};