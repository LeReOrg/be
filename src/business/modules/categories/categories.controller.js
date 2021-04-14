import { CategoriesService } from "./categories.service";
import { createCategory, updateCategory, getProductsByCategoryId } from "./categories.schema";

export class CategoriesController {
  #service;

  constructor() {
    this.#service = new CategoriesService();
  }

  create = async ({ reqBody }) => {
    const data = await createCategory.validateAsync(reqBody);
    return this.#service.create(data);
  };

  update = async ({ reqParams, reqBody }) => {
    const input = { ...reqParams, ...reqBody };
    const data = await updateCategory.validateAsync(input);
    return this.#service.update(data.categoryId, data);
  };

  get = () => {
    return this.#service.get();
  };

  getByIdOrThrowError = ({ reqParams }) => {
    return this.#service.getByIdOrThrowError(reqParams.categoryId);
  };

  getProductsByCategoryId = async ({ reqParams, reqQuery }) => {
    const input = { ...reqParams, ...reqQuery };
    const { categoryId, ...filterAndOptions } = await getProductsByCategoryId.validateAsync(input);
    return this.#service.getProductsByCategoryId(categoryId, filterAndOptions);
  };
};