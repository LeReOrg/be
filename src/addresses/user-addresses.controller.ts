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
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AddressesService } from "./addresses.service";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { AddressDto } from "./dtos/address.dto";
import { CreateUserAddressDto } from "./dtos/create-user-address.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { FilterUserAddressesDto } from "./dtos/filter-user-addresses.dto";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { UpdateUserAddressDto } from "./dtos/update-user-address.dto";
import { OkResponseBodyDto } from "../common/dtos/ok.response.dto";

@Controller("/users/addresses")
@ApiTags("User Addresses")
export class UserAddressesController {
  constructor(private addressesService: AddressesService) {}

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
    const result = await this.addressesService.createUserAddress(input, req.user);
    return plainToClass(AddressDto, result);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiExtraModels(AddressDto, PaginatedDto)
  @ApiBearerAuth()
  @ApiPaginatedResponse(AddressDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findUserAddresses(
    @Request() req: any,
    @Query() input: FilterUserAddressesDto,
  ): Promise<PaginatedDto<AddressDto>> {
    const result = await this.addressesService.filterAddresses(
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

  @Get("/:id")
  @ApiOperation({ summary: "Find an active user address by id" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: AddressDto })
  @ApiResponse({ status: 404, description: "Not Found User Address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  @UseGuards(JwtAuthGuard)
  public async findActiveUserAddressById(
    @Request() req: any,
    @Param("id") id: string,
  ): Promise<AddressDto> {
    const result = await this.addressesService.findActiveUserAddressById(id, req.user);
    return plainToClass(AddressDto, result);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "Update an active user address by id" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: AddressDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 404, description: "Not Found User Address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  @UseGuards(JwtAuthGuard)
  public async updateUserAddressById(
    @Request() req: any,
    @Param("id") id: string,
    @Body() input: UpdateUserAddressDto,
  ): Promise<AddressDto> {
    const result = await this.addressesService.updateUserAddressById(id, input, req.user);
    return plainToClass(AddressDto, result);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Delete an active user address by id" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 403, description: "Could not delete default|pick up|shipping address" })
  @ApiResponse({ status: 404, description: "Not Found User Address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  @UseGuards(JwtAuthGuard)
  public async deleteUserAddressById(
    @Request() req: any,
    @Param("id") id: string,
  ): Promise<OkResponseBodyDto> {
    await this.addressesService.deleteUserAddressById(id, req.user);
    return { status: "OK" };
  }

  // NOTE: This api only used to update old user addresses to have status
  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateUserAddresses() {
    await this.addressesService.updateUserAddresses();
    return { status: "OK" };
  }
}
