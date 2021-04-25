import productsService from "./products.service";
import { createProductSchema, getProductsSchema } from "./products.schema";

class ProductsController {
  create = async ({ reqBody }) => {
    const data = await createProductSchema.validateAsync(reqBody);
    return productsService.create(data);
  };

  getByIdOrThrowError = ({ reqParams }) => {
    return productsService.getByIdOrThrowError(reqParams.productId);
  };

  get = async ({ reqQuery }) => {
    const input = await getProductsSchema.validateAsync(reqQuery);
    return productsService.get(input);
  };
};

const productsController = new ProductsController();

Object.freeze(productsController);

export default productsController;