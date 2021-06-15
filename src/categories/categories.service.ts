import { Injectable } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { Category } from "./schemas/category.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { Product } from "../products/schemas/product.schema";
import { FilterProductsDto } from "../products/dtos/filter-products.dto";
import { ProductsService } from "../products/products.service";

@Injectable()
export class CategoriesService {
  constructor(
    private __categoriesRepository: CategoriesRepository,
    private __cloudinaryService: CloudinaryService,
    private __productsService: ProductsService,
  ) {}

  public async fetchAll(): Promise<Category[]> {
    return this.__categoriesRepository.findAll();
  }

  public async createCategory(input: CreateCategoryDto): Promise<Category> {
    const thumbnail = await this.__cloudinaryService.uploadCategoryImage(input.thumbnail);
    return this.__categoriesRepository.createOne({
      name: input.name,
      thumbnail,
    });
  }

  public async updateCategoryById(id: string, input: UpdateCategoryDto): Promise<Category> {
    const category = await this.__categoriesRepository.findByIdOrThrowException(id);

    const update: Partial<Category> = {};

    if (input.name) {
      update.name = input.name;
    }
    if (input.thumbnail) {
      update.thumbnail = await this.__cloudinaryService.uploadCategoryImage(
        input.thumbnail,
        category.thumbnail.publicId,
      );
    }

    return this.__categoriesRepository.findByIdAndUpdate(id, update);
  }

  public async findByIdOrThrowError(id: string): Promise<Category> {
    return this.__categoriesRepository.findByIdOrThrowException(id);
  }

  public async filterProductsByCategoryId(
    id: string,
    input: FilterProductsDto,
  ): Promise<PaginatedDocument<Product>> {
    const category = await this.findByIdOrThrowError(id);

    return this.__productsService.filterProducts(
      {
        categories: [category],
        keyword: input.keyword,
        priceRange: input.priceRange,
        isTopProduct: input.isTopProduct,
        wards: input.wards,
        districts: input.districts,
        provinces: input.provinces,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
        populate: input.populate,
      },
    );
  }
}
