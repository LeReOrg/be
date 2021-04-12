import { ProductsRepository } from "./products.repository";
import { CategoriesRepository } from "../categories/categories.repository";
import { CloudinaryService } from "../../../share/modules/cloudinary/cloudinary.service";

export class ProductsService {
  #productsRepository;
  #categoriesRepository;
  #cloudinaryService;

  constructor() {
    this.#productsRepository = new ProductsRepository();
    this.#categoriesRepository = new CategoriesRepository();
    this.#cloudinaryService = new CloudinaryService();
  }

  // uploadProductImage = (base64, publicId, productId) => {
  //   return this.#cloudinaryService.uploadBase64(base64, {
  //     folder: `Products/${productId}`,
  //     publicId,
  //   });
  // };

  create = async (data) => {
    await this.#categoriesRepository.getByIdOrThrowError(data.categoryId);
    const product = this.#productsRepository.construct(data);
    return this.#productsRepository.save(product);
  };

  getById = productId => this.#productsRepository.getByIdOrThrowError(productId);
};