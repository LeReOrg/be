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

  getByIdOrThrowError = (productId) => {
    return this.#productsRepository.getByIdOrThrowError(productId);
  };

  get = ({
    categoryIds,
    cities,
    price,
    page,
    limit,
    sort,
  }) => {
    const rangePrice = price && price.split("-");

    const customSort = {};
    if (sort) sort.split(",").forEach(item => {
      // This statement to handle this case: sort="price:asc,"
      if (item) {
        const fieldValuePair = item.toLowerCase().split(":");
        const field = fieldValuePair[0];
        const value = fieldValuePair[1];
        customSort[field] = value;
      }
    });

    return this.#productsRepository.get(
      {
        categoryIds,
        cities: cities && cities.split(","),
        fromPrice: price && rangePrice[0],
        toPrice: price && rangePrice[1],
      }, {
        page,
        limit,
        sort: customSort,
      }
    );
  };
};