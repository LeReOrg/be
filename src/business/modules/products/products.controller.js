import { ProductsService } from "./products.service";
import { createProductSchema, getProductsSchema } from "./products.schema";

export class ProductsController {
  #productsService;

  constructor() {
    this.#productsService = new ProductsService();
  }

  create = async ({ reqBody }) => {
    const data = await createProductSchema.validateAsync(reqBody);
    return this.#productsService.create(data);
  };

  getByIdOrThrowError = ({ reqParams }) => {
    return this.#productsService.getByIdOrThrowError(reqParams.productId);
  };

  get = async ({ reqQuery }) => {
    const input = await getProductsSchema.validateAsync(reqQuery);
    return this.#productsService.get(input);
  };
};