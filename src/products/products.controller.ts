import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductDto } from "./dtos/product.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { CreateProductDto } from "./dtos/create-product.dto";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { FilterProductsDto } from "./dtos/filter-products.dto";
import { OkResponseBodyDto } from "../common/dtos/ok.response.dto";

@Controller("/products")
@ApiTags("Products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a product" })
  @ApiResponse({ status: 201, type: ProductDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 404, description: "Not Found Category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createProduct(@Request() req, @Body() input: CreateProductDto): Promise<ProductDto> {
    const result = await this.productsService.createProduct(input, req.user);
    return plainToClass(ProductDto, result);
  }

  @Get()
  @ApiOperation({ summary: "Filter products" })
  @ApiExtraModels(ProductDto, PaginatedDto)
  @ApiPaginatedResponse(ProductDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async filterProductsDto(
    @Query() input: FilterProductsDto,
  ): Promise<PaginatedDto<ProductDto>> {
    const result = await this.productsService.filterProducts(
      {
        keyword: input.keyword,
        priceRange: input.priceRange,
        isTopProduct: input.isTopProduct,
        wards: input.wards,
        districts: input.districts,
        provinces: input.provinces,
        available: input.available,
      },
      {
        populate: input.populate,
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );

    return plainToClassFromExist(new PaginatedDto<ProductDto>(ProductDto), result);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Find product detail by id" })
  @ApiResponse({ status: 200, type: ProductDto })
  @ApiResponse({ status: 404, description: "Not Found Product" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findProductDetailById(@Param("id") id: string): Promise<ProductDto> {
    const result = await this.productsService.findProductDetailById(id);
    return plainToClass(ProductDto, result);
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a product by id" })
  @ApiResponse({ status: 200, type: ProductDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 403, description: "Could not modify other user product" })
  @ApiResponse({ status: 404, description: "Not Found Product" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateProductById(
    @Request() req,
    @Param("id") id: string,
    @Body() input: CreateProductDto,
  ): Promise<ProductDto> {
    const result = await this.productsService.updateProductById(id, input, req.user);
    return plainToClass(ProductDto, result);
  }

  @Delete("/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a product by id" })
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 403, description: "Could not modify other user product" })
  @ApiResponse({ status: 404, description: "Not Found Product" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async deleteProductById(
    @Request() req,
    @Param("id") id: string,
  ): Promise<OkResponseBodyDto> {
    await this.productsService.deleteProductById(id, req.user);
    return { status: "OK" };
  }

  // NOTE: This method is used to add "status" to existing products which don't have
  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateProducts(): Promise<OkResponseBodyDto> {
    await this.productsService.updateProducts();
    return { status: "OK" };
  }
}
