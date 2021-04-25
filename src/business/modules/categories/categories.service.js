import categoriesRepository from "./categories.repository";
import cloudinaryService from "../../../share/modules/cloudinary/cloudinary.service";
import productsService from "../products/products.service";

class CategoriesService {
  create = async (data) => {
    const thumbnail = await cloudinaryService.uploadCategoryImage(data.thumbnail);
    const payload = categoriesRepository.construct({
      name: data.name,
      thumbnail,
    });
    return categoriesRepository.save(payload);
  };

  update = async (id, data) => {
    const category = await categoriesRepository.getByIdOrThrowError(id);
    if (data.name) {
      category.name = data.name;
    }
    if (data.thumbnail) {
      category.thumbnail = await cloudinaryService.uploadCategoryImage(
        data.thumbnail,
        category.thumbnail.publicId,
      );
    }
    return categoriesRepository.save(category);
  };

  get = () => {
    return categoriesRepository.getAll();
  };

  getByIdOrThrowError = (categoryId) => {
    return categoriesRepository.getByIdOrThrowError(categoryId);
  };

  getProductsByCategoryId = (categoryId, filterAndOptions) => {
    return productsService.get({ categoryIds: [categoryId], ...filterAndOptions });
  };
};

const categoriesService = new CategoriesService();

Object.freeze(categoriesService);

export default categoriesService;