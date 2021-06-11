import { Injectable } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Product } from "./schemas/product.schema";
import { PaginatedProductsRequestDto } from "./dtos/paginated-products.request.dto";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { UploadProductImageDto } from "./dtos/upload-product-image.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { User } from "../users/schemas/user.schema";
import { CategoriesRepository } from "../categories/categories.repository";
import { CloudinaryImage } from "../cloudinary/schemas/cloudinary-image.schema";
import { Discount } from "./schemas/discount.schema";

@Injectable()
export class ProductsService {
  constructor(
    private __productsRepository: ProductsRepository,
    private __categoriesRepository: CategoriesRepository,
    private __cloudinaryService: CloudinaryService,
  ) {}

  public async fetchAll(input: PaginatedProductsRequestDto): Promise<PaginatedDocument<Product>> {
    return this.__productsRepository.fetchAll(
      {
        rangedPrice: input.price,
        cities: input.cities?.split(","),
        isTopProduct: input.isTopProduct,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );
  }

  private async __uploadProductImages(
    input: UploadProductImageDto[],
    productId: string,
  ): Promise<CloudinaryImage[]> {
    const images = await Promise.all(
      input.map(async (item, index) => {
        const { base64, isLandingImage } = item;
        const order = isLandingImage ? 0 : index + 1;
        const uploadedImage = await this.__cloudinaryService.uploadProductImage(productId, base64);
        return { order, ...uploadedImage };
      }),
    );

    // Image at index 0 is consider for thumbnail/landing image
    images.sort((a, b) => a.order - b.order);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return images.map(({ order, ...image }) => image);
  }

  private __sortProductDiscounts(input: Discount[]): Discount[] {
    // Only work if not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs,
    // FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within object
    const deepClonedInput = JSON.parse(JSON.stringify(input));

    deepClonedInput.sort((a, b) => (a.days > b.days ? 1 : -1));

    return deepClonedInput;
  }

  public async createProduct(input: CreateProductDto, user: User): Promise<Product> {
    const category = await this.__categoriesRepository.findByIdOrThrowException(input.categoryId);

    const sortedDiscounts = this.__sortProductDiscounts(input.discounts || []);

    const product = await this.__productsRepository.createOne({
      name: input.name,
      price: input.price,
      quantity: input.quantity,
      description: input.description,
      depositPrice: input.depositPrice,
      shortestHiredDays: input.shortestHiredDays,
      isTopProduct: input.isTopProduct,
      discounts: sortedDiscounts,
      location: input.location,
      category,
      user,
    });

    const images = await this.__uploadProductImages(input.images, product.id);

    return this.__productsRepository.findByIdAndUpdate(product.id, { images });
  }
}
