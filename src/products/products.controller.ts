import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductDto } from "./dtos/product.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PaginatedProductsRequestDto } from "./dtos/paginated-products.request.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { CreateProductDto } from "./dtos/create-product.dto";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";

@Controller("/products")
@ApiTags("Products")
export class ProductsController {
  constructor(private __productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: "Fetch all products" })
  @ApiExtraModels(ProductDto, PaginatedDto)
  @ApiPaginatedResponse(ProductDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async fetchAll(@Query() input: PaginatedProductsRequestDto) {
    const result = await this.__productsService.fetchAll(input);
    return plainToClassFromExist(new PaginatedDto<ProductDto>(ProductDto), result);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a product" })
  @ApiResponse({ status: 201, type: ProductDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 404, description: "Not Found Category" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createProduct(@Request() req, @Body() input: CreateProductDto): Promise<ProductDto> {
    const result = await this.__productsService.createProduct(input, req.user);
    return plainToClass(ProductDto, result);
  }
}
