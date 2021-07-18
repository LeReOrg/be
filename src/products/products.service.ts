import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductsRepository } from "./products.repository";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { Product } from "./schemas/product.schema";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { UploadProductImageDto } from "./dtos/upload-product-image.dto";
import { CreateProductDto } from "./dtos/create-product.dto";
import { User } from "../users/schemas/user.schema";
import { CategoriesRepository } from "../categories/categories.repository";
import { CloudinaryImage } from "../cloudinary/schemas/cloudinary-image.schema";
import { Discount } from "./schemas/discount.schema";
import { Breadcrumb } from "./schemas/breadcrumb.schema";
import { BreadcrumbDto } from "./dtos/breadcrumb.dto";
import { Category } from "../categories/schemas/category.schema";
import { AddressesService } from "../addresses/addresses.service";
import { AddressesRepository } from "../addresses/addresses.repository";
import { FilterQuery } from "mongoose";
import { Address } from "../addresses/schemas/address.schema";

@Injectable()
export class ProductsService {
  constructor(
    private productsRepository: ProductsRepository,
    private categoriesRepository: CategoriesRepository,
    private cloudinaryService: CloudinaryService,
    private addressesService: AddressesService,
    private addressesRepository: AddressesRepository,
  ) {}

  public async filterProducts(
    filters: {
      keyword?: string;
      priceRange?: string;
      isTopProduct?: boolean;
      wards?: string[];
      districts?: string[];
      provinces?: string[];
      categories?: Category[];
      users?: User[];
      available?: boolean;
    },
    options: {
      limit: number;
      page: number;
      sort?: any;
      populate?: string[];
    },
  ): Promise<PaginatedDocument<Product>> {
    const conditions: FilterQuery<Product> = {};

    if (filters) {
      const {
        keyword,
        priceRange,
        isTopProduct,
        wards,
        districts,
        provinces,
        categories,
        users,
        available,
      } = filters;

      if (keyword) {
        conditions.name = { $regex: keyword, $options: "i" };
      }
      if (priceRange) {
        const [fromPrice, toPrice] = priceRange.split("-");
        const fromPriceCondition = fromPrice && { $gte: parseFloat(fromPrice) };
        const toPriceCondition = toPrice && { $lte: parseFloat(toPrice) };

        conditions.price = { ...fromPriceCondition, ...toPriceCondition };
      }
      if (typeof isTopProduct === "boolean") {
        conditions.isTopProduct = isTopProduct || { $not: { $eq: true } };
      }
      if (wards?.length || districts?.length || provinces?.length) {
        const addressesConditions: FilterQuery<Address> = {};

        if (wards?.length) {
          addressesConditions.ward = { $in: wards };
        }
        if (districts?.length) {
          addressesConditions.district = { $in: districts };
        }
        if (provinces?.length) {
          addressesConditions.province = { $in: provinces };
        }

        const addresses = await this.addressesRepository.findAll(addressesConditions);

        conditions.address = { $in: addresses };
      }
      if (categories?.length) {
        conditions.category = { $in: categories };
      }
      if (users?.length) {
        conditions.user = { $in: users };
      }
      if (typeof available === "boolean") {
        conditions.quantity = available ? { $gte: 1 } : { $eq: 0 };
      }
    }

    // TODO: Using aggregation
    return this.productsRepository.paginate(conditions, {
      ...options,
      projection: {
        images: { $slice: 1 },
      },
    });
  }

  public async findProductDetailById(id: string): Promise<Product> {
    return this.productsRepository.findByIdOrThrowException(id, undefined, {
      populate: ["user", "category", "address"],
    });
  }

  private async uploadProductImages(
    input: UploadProductImageDto[],
    productId: string,
  ): Promise<CloudinaryImage[]> {
    const images = await Promise.all(
      input.map(async (item, index) => {
        const { base64, isLandingImage } = item;
        const order = isLandingImage ? 0 : index + 1;
        const uploadedImage = await this.cloudinaryService.uploadProductImage(productId, base64);
        return { order, ...uploadedImage };
      }),
    );

    // Image at index 0 is consider for thumbnail/landing image
    images.sort((a, b) => a.order - b.order);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return images.map(({ order, ...image }) => image);
  }

  private sortProductDiscounts(input: Discount[]): Discount[] {
    // Only work if not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs,
    // FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within object
    const deepClonedInput = JSON.parse(JSON.stringify(input));

    deepClonedInput.sort((a, b) => (a.days > b.days ? 1 : -1));

    return deepClonedInput;
  }

  private async validateCreateProductInput(input: CreateProductDto) {
    const setOfCategoryIds: Set<string> = new Set();

    setOfCategoryIds.add(input.categoryId);

    input.breadcrumbs?.forEach((breadcrumb) => {
      if (breadcrumb.categoryId) {
        setOfCategoryIds.add(breadcrumb.categoryId);
      }
    });

    // No duplicated
    const categoryIds = [...setOfCategoryIds];

    const categories = await this.categoriesRepository.findAll(
      { _id: { $in: categoryIds } },
      { _id: 1 },
    );

    if (categoryIds.length !== categories.length) {
      throw new NotFoundException("Not found category");
    }

    return categories;
  }

  private formatBreadcrumbsDtoToSchema(
    input: BreadcrumbDto[],
    categories: Category[],
  ): Breadcrumb[] {
    return input.map((breadcrumb) => {
      const breadCrumbCategory = categories.find(
        (category) => category.id === breadcrumb.categoryId,
      );

      const result: Breadcrumb = {
        name: breadcrumb.name,
        url: breadcrumb.url,
        categoryId: breadCrumbCategory?._id,
      };

      return result;
    });
  }

  public async createProduct(input: CreateProductDto, user: User): Promise<Product> {
    const categories = await this.validateCreateProductInput(input);

    const category = categories.find((category) => category.id === input.categoryId);

    const payload: Partial<Product> = {
      name: input.name,
      price: input.price,
      quantity: input.quantity,
      description: input.description,
      depositPrice: input.depositPrice,
      shortestHiredDays: input.shortestHiredDays,
      isTopProduct: input.isTopProduct,
      label: input.label,
      term: input.term,
      requiredLicenses: input.requiredLicenses,
      category,
      user,
    };

    if (input.breadcrumbs) {
      payload.breadcrumbs = this.formatBreadcrumbsDtoToSchema(input.breadcrumbs, categories);
    }
    if (input.discounts) {
      payload.discounts = this.sortProductDiscounts(input.discounts);
    }

    payload.address = await this.addressesService.createAddress(input.address);

    const product = await this.productsRepository.createOne(payload);

    const [images] = await Promise.all([
      this.uploadProductImages(input.images, product.id),
      this.addressesService.updateAddressById(payload.address._id, { product }),
    ]);

    return this.productsRepository.findByIdAndUpdate(
      product.id,
      { images },
      { populate: ["user", "category", "address"] },
    );
  }
}
