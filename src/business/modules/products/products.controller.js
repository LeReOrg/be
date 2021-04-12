import validationSchema from "./validation-schema";
import { ProductsService } from "./products.service";

export class ProductsController {
  #productsService;

  constructor() {
    this.#productsService = new ProductsService();
  }

  create = async ({ reqBody }) => {
    const data = await validationSchema.createProductSchema.validateAsync(reqBody);
    return this.#productsService.create(data);
  };

  getById = ({ reqParams }) => this.#productsService.getById(reqParams.productId);
};