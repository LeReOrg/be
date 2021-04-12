import validationSchema from "./validation-schema";
import { CategoriesService } from "./categories.service";

export class CategoriesController {
  #service;

  constructor() {
    this.#service = new CategoriesService();
  }

  get = () => this.#service.get();

  create = async ({ reqBody }) => {
    const data = await validationSchema.createCategory.validateAsync(reqBody);
    return this.#service.create(data);
  };

  update = async ({ reqParams, reqBody }) => {
    const input = { ...reqParams, ...reqBody };
    const data = await validationSchema.updateCategory.validateAsync(input);
    return this.#service.update(data.categoryId, data);
  };

  getProductsByCategoryId = async ({ reqParams, reqQuery }) => {
    const input = { ...reqParams, ...reqQuery };
    const { categoryId, page, limit } = await validationSchema.getProductsByCategoryId.validateAsync(input);
    return this.#service.getProductsByCategoryId(categoryId, { page, limit });
  };
};