import { Body, Controller, Get, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AddressesService } from "./addresses.service";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { AddressDto } from "./dtos/address.dto";
import { CreateUserAddressDto } from "./dtos/create-user-address.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { FilterUserAddressesDto } from "./dtos/filter-user-addresses.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { User } from "../users/schemas/user.schema";

@Controller("/users/addresses")
@ApiTags("User Addresses")
export class UserAddressesController {
  constructor(private __addressesService: AddressesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Create user address" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: AddressDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createUserAddress(
    @Request() req: any,
    @Body() input: CreateUserAddressDto,
  ): Promise<AddressDto> {
    const result = await this.__addressesService.createUserAddress(input, req.user);
    return plainToClass(AddressDto, result);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(AddressDto, PaginatedDto)
  @ApiPaginatedResponse(AddressDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findUserAddresses(
    @Request() req: any,
    @Query() input: FilterUserAddressesDto,
  ): Promise<PaginatedDto<AddressDto>> {
    const result = await this.__addressesService.filterAddresses(
      {
        wards: input.wards,
        districts: input.districts,
        provinces: input.provinces,
        users: [req.user],
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
      },
    );
    return plainToClassFromExist(new PaginatedDto<AddressDto>(AddressDto), result);
  }
}
