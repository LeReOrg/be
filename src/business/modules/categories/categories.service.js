import { CategoriesRepository } from "./categories.repository";
import { ProductsRepository } from "../products/products.repository";
import { CloudinaryService } from "../../../share/modules/cloudinary/cloudinary.service";

export class CategoriesService {
  #categoriesRepository;
  #productsRepository;
  #cloudinaryService;

  constructor() {
    this.#categoriesRepository = new CategoriesRepository();
    this.#productsRepository = new ProductsRepository();
    this.#cloudinaryService = new CloudinaryService();
  }

  uploadCategoryImage = (base64, publicId) => {
    return this.#cloudinaryService.uploadBase64(base64, {
      folder: "Categories",
      publicId,
    });
  };

  get = () => this.#categoriesRepository.getAll();

  create = async (data) => {
    const thumbnail = await this.uploadCategoryImage(data.thumbnail);
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
      category.thumbnail = await this.uploadCategoryImage(
        data.thumbnail,
        category.thumbnail.publicId,
      );
    }
    return this.#categoriesRepository.save(category);
  };

  getProductsByCategoryId = async (id, options) => {
    await this.#categoriesRepository.getByIdOrThrowError(id);
    return this.#productsRepository.getAll({ categoryIds: [id] }, options);
  };
};