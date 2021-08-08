import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CategoriesRepository } from "./categories.repository";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { Category } from "./schemas/category.schema";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { PaginatedDocument } from "../common/interfaces/paginated-document";
import { Product } from "../products/schemas/product.schema";
import { FilterProductsDto } from "../products/dtos/filter-products.dto";
import { ProductsService } from "../products/products.service";
import { CategoryStatus } from "./enum/category-status";
import { FilterQuery } from "mongoose";

@Injectable()
export class CategoriesService {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  public async createCategory(input: CreateCategoryDto): Promise<Category> {
    const thumbnail = await this.cloudinaryService.uploadCategoryImage(input.thumbnail);
    return this.categoriesRepository.createOne({
      name: input.name,
      thumbnail,
      status: CategoryStatus.Active,
    });
  }

  public async updateCategoryById(id: string, input: UpdateCategoryDto): Promise<Category> {
    const category = await this.findActiveCategoryById(id);

    const update: Partial<Category> = {};

    if (input.name) {
      update.name = input.name;
    }
    if (input.thumbnail) {
      update.thumbnail = await this.cloudinaryService.uploadCategoryImage(
        input.thumbnail,
        category.thumbnail.publicId,
      );
    }

    return this.categoriesRepository.findByIdAndUpdate(id, update);
  }

  public async filterProductsByCategoryId(
    id: string,
    input: FilterProductsDto,
  ): Promise<PaginatedDocument<Product>> {
    const category = await this.findActiveCategoryById(id);

    return this.productsService.filterProducts(
      {
        categories: [category],
        keyword: input.keyword,
        priceRange: input.priceRange,
        isTopProduct: input.isTopProduct,
        wards: input.wards,
        districts: input.districts,
        provinces: input.provinces,
        available: input.available,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
        populate: input.populate,
      },
    );
  }

  public async filterCategories(
    filter?: { ids?: any[]; status?: string },
    projection?: any | null,
  ): Promise<Category[]> {
    const conditions: FilterQuery<Category> = { status: CategoryStatus.Active };
    const { ids, status } = filter || {};
    if (ids) conditions._id = { $in: ids };
    if (status) conditions.status = status;
    return this.categoriesRepository.findAll(conditions, projection);
  }

  public async findActiveCategoryById(id: any): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      _id: id,
      status: CategoryStatus.Active,
    });
    if (!category) throw new NotFoundException("Not found category");
    return category;
  }

  public async deleteCategoryById(id: any) {
    const category = await this.findActiveCategoryById(id);
    return this.categoriesRepository.updateOne(
      { _id: category._id },
      { status: CategoryStatus.Inactive },
    );
  }

  // NOTE: This method is used to add "status" to existing categories which don't have
  public async updateCategories(): Promise<void> {
    await this.categoriesRepository.updateMany(
      { status: { $exists: false } },
      { status: CategoryStatus.Active },
    );
  }
}
