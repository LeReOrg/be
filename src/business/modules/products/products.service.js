import productsRepository from "./products.repository";
import categoriesRepository from "../categories/categories.repository";
import cloudinaryService from "../../../share/modules/cloudinary/cloudinary.service";

class ProductsService {
  uploadProductImages = async (input, productId) => {
    const images = await Promise.all(input.map(async (item, index) => {
      let base64 = item;
      let order = index + 1;
      if (typeof item === "object") {
        base64 = item.base64;
        if (item.isLandingImage) {
          order = 0;
        }
      }
      const info = await cloudinaryService.uploadProductImage(base64, productId);
      return { ...info, order };
    }));

    images.sort((a, b) => a.order - b.order);

    return images;
  };

  create = async (data) => {
    await categoriesRepository.getByIdOrThrowError(data.categoryId);
    const product = productsRepository.construct(data);
    product.images = await this.uploadProductImages(data.images, product.id);
    await productsRepository.save(product);
    return product;
  };

  getByIdOrThrowError = (productId) => {
    return productsRepository.getByIdOrThrowError(productId);
  };

  get = ({
    categoryIds,
    cities,
    price,
    isTopProduct,
    page,
    limit,
    sort,
  }) => {
    const rangePrice = price && price.split("-");

    const customSort = {};
    if (sort) sort.split(",").forEach(item => {
      // This statement to handle this case: sort="price:asc,"
      if (item) {
        const fieldValuePair = item.split(":");
        const field = fieldValuePair[0];
        const value = fieldValuePair[1];
        customSort[field] = value;
      }
    });

    return productsRepository.get(
      {
        categoryIds,
        cities: cities && cities.split(","),
        fromPrice: price && rangePrice[0],
        toPrice: price && rangePrice[1],
        isTopProduct,
      }, {
        page,
        limit,
        sort: customSort,
      }
    );
  };
};

const productsService = new ProductsService();

Object.freeze(productsService);

export default productsService;