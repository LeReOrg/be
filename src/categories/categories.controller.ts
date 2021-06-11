import { Controller, Get, Post, Body, Patch, Param, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { ProductDto } from "../products/dtos/product.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { PaginatedProductsRequestDto } from "../products/dtos/paginated-products.request.dto";

@Controller("categories")
@ApiTags("Categories")
export class CategoriesController {
  constructor(private __categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create a category" })
  @ApiResponse({ status: 201, type: CategoryDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createCategory(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
    const result = await this.__categoriesService.createCategory(input);
    return plainToClass(CategoryDto, result);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "Update a category by id" })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateCategory(
    @Param("id") id: string,
    @Body() input: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const result = await this.__categoriesService.updateCategoryById(id, input);
    return plainToClass(CategoryDto, result);
  }

  @Get()
  @ApiOperation({ summary: "Fetch all categories. No pagination support" })
  @ApiResponse({ status: 200, type: [CategoryDto] })
  @ApiResponse({ status: 422, description: "Duplicate email" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async fetchAll(): Promise<CategoryDto> {
    const result = await this.__categoriesService.fetchAll();
    return plainToClass(CategoryDto, JSON.parse(JSON.stringify(result)));
  }

  @Get("/:id")
  @ApiOperation({ summary: "Find a category by id" })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findByIdOrThrowError(@Param("id") id: string): Promise<CategoryDto> {
    const result = await this.__categoriesService.findByIdOrThrowError(id);
    return plainToClass(CategoryDto, result);
  }

  @Get("/:id/products")
  @ApiOperation({ summary: "Fetch all products by category id" })
  @ApiExtraModels(ProductDto, PaginatedDto)
  @ApiPaginatedResponse(ProductDto)
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async fetchAllProductsByCategoryId(
    @Param("id") id: string,
    @Query() input: PaginatedProductsRequestDto,
  ): Promise<PaginatedDto<ProductDto>> {
    const result = await this.__categoriesService.fetchAllProductsByCategoryId(id, input);
    return plainToClassFromExist(new PaginatedDto<ProductDto>(ProductDto), result);
  }
}
