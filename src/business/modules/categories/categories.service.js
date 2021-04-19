import { CategoriesRepository } from "./categories.repository";
import { ProductsService } from "../products/products.service";
import { CloudinaryService } from "../../../share/modules/cloudinary/cloudinary.service";

export class CategoriesService {
  #categoriesRepository;
  #productsService;
  #cloudinaryService;

  constructor() {
    this.#categoriesRepository = new CategoriesRepository();
    this.#productsService = new ProductsService();
    this.#cloudinaryService = new CloudinaryService();
  }

  create = async (data) => {
    const thumbnail = await this.#cloudinaryService.uploadCategoryImage(data.thumbnail);
    const payload = this.#categoriesRepository.construct({
      name: data.name,
      thumbnail,
    });
    return this.#categoriesRepository.save(payload);
  };

  update = async (id, data) => {
    const category = await this.#categoriesRepository.getByIdOrThrowError(id);
    if (data.name) {
      category.name = data.name;
    }
    if (data.thumbnail) {
      category.thumbnail = await this.#cloudinaryService.uploadCategoryImage(
        data.thumbnail,
        category.thumbnail.publicId,
      );
    }
    return this.#categoriesRepository.save(category);
  };

  get = () => {
    return this.#categoriesRepository.getAll();
  };

  getByIdOrThrowError = (categoryId) => {
    return this.#categoriesRepository.getByIdOrThrowError(categoryId);
  };

  getProductsByCategoryId = (categoryId, filterAndOptions) => {
    return this.#productsService.get({ categoryIds: [categoryId], ...filterAndOptions });
  };
};