import categoriesService from "./categories.service";
import { createCategory, updateCategory, getProductsByCategoryId } from "./categories.schema";

export class CategoriesController {
  create = async ({ reqBody }) => {
    const data = await createCategory.validateAsync(reqBody);
    return categoriesService.create(data);
  };

  update = async ({ reqParams, reqBody }) => {
    const input = { ...reqParams, ...reqBody };
    const data = await updateCategory.validateAsync(input);
    return categoriesService.update(data.categoryId, data);
  };

  get = () => {
    return categoriesService.get();
  };

  getByIdOrThrowError = ({ reqParams }) => {
    return categoriesService.getByIdOrThrowError(reqParams.categoryId);
  };

  getProductsByCategoryId = async ({ reqParams, reqQuery }) => {
    const input = { ...reqParams, ...reqQuery };
    const { categoryId, ...filterAndOptions } = await getProductsByCategoryId.validateAsync(input);
    return categoriesService.getProductsByCategoryId(categoryId, filterAndOptions);
  };
};

const categoriesController = new CategoriesController();

Object.freeze(categoriesController);

export default categoriesController;