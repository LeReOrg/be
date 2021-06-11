import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { UserDto } from "./dtos/user.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { PaginatedRequestDto } from "../common/dtos/paginated.request.dto";
import { ProductDto } from "../products/dtos/product.dto";
import { PaginatedProductsRequestDto } from "../products/dtos/paginated-products.request.dto";

@Controller("/users")
@ApiTags("Users")
export class UsersController {
  constructor(private __usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Fetch all users" })
  @ApiExtraModels(UserDto, PaginatedDto)
  @ApiPaginatedResponse(UserDto)
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async fetchAll(@Query() input: PaginatedRequestDto) {
    const result = await this.__usersService.fetchAll(input);
    return plainToClassFromExist(new PaginatedDto<UserDto>(UserDto), result);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update logged in user information" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 401, description: "Invalid token" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateUser(@Request() req: any, @Body() input: UpdateUserDto): Promise<UserDto> {
    const document = await this.__usersService.updateUser(req.user, input);
    return plainToClass(UserDto, document);
  }

  @Get("/:id/products")
  @ApiOperation({ summary: "Fetch all products by user id" })
  @ApiExtraModels(ProductDto, PaginatedDto)
  @ApiPaginatedResponse(ProductDto)
  @ApiResponse({ status: 404, description: "Not found user" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async fetchAllProductsByUserId(
    @Param("id") id: string,
    @Query() input: PaginatedProductsRequestDto,
  ): Promise<PaginatedDto<ProductDto>> {
    const result = await this.__usersService.fetchAllProductsByUserId(id, input);
    return plainToClassFromExist(new PaginatedDto<ProductDto>(ProductDto), result);
  }
}
