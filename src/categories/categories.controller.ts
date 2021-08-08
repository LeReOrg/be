import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryDto } from "./dtos/category.dto";
import { CreateCategoryDto } from "./dtos/create-category.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { UpdateCategoryDto } from "./dtos/update-category.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { ProductDto } from "../products/dtos/product.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { FilterProductsDto } from "../products/dtos/filter-products.dto";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { OkResponseBodyDto } from "../common/dtos/ok.response.dto";

@Controller("categories")
@ApiTags("Categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: "Create a category" })
  @ApiResponse({ status: 201, type: CategoryDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createCategory(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
    const result = await this.categoriesService.createCategory(input);
    return plainToClass(CategoryDto, result);
  }

  @Get()
  @ApiOperation({ summary: "Filter categories. No pagination support" })
  @ApiResponse({ status: 200, type: [CategoryDto] })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async filterCategories(): Promise<CategoryDto> {
    const result = await this.categoriesService.filterCategories();
    return plainToClass(CategoryDto, JSON.parse(JSON.stringify(result)));
  }

  @Get("/:id")
  @ApiOperation({ summary: "Find an active category by id" })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findActiveCategoryById(@Param("id") id: string): Promise<CategoryDto> {
    const result = await this.categoriesService.findActiveCategoryById(id);
    return plainToClass(CategoryDto, result);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "Update an active category by id" })
  @ApiResponse({ status: 200, type: CategoryDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateCategoryById(
    @Param("id") id: string,
    @Body() input: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    const result = await this.categoriesService.updateCategoryById(id, input);
    return plainToClass(CategoryDto, result);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Delete an category by id" })
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async deleteCategoryById(@Param("id") id: string): Promise<OkResponseBodyDto> {
    await this.categoriesService.deleteCategoryById(id);
    return { status: "OK" };
  }

  @Get("/:id/products")
  @ApiOperation({ summary: "Filter products by category id" })
  @ApiExtraModels(ProductDto, PaginatedDto)
  @ApiPaginatedResponse(ProductDto)
  @ApiResponse({ status: 404, description: "Not found category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async filterProductsByCategoryId(
    @Param("id") id: string,
    @Query() input: FilterProductsDto,
  ): Promise<PaginatedDto<ProductDto>> {
    const result = await this.categoriesService.filterProductsByCategoryId(id, input);
    return plainToClassFromExist(new PaginatedDto<ProductDto>(ProductDto), result);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateCategories() {
    await this.categoriesService.updateCategories();
    return { status: "OK" };
  }
}
