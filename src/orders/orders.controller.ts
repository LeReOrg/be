import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ApiPaginatedResponse } from "../common/decorators/api-paginated-response.decorator";
import { PaginatedDto } from "../common/dtos/paginated.dto";
import { plainToClass, plainToClassFromExist } from "class-transformer";
import { JwtAuthGuard } from "../authentication/guards/jwt.guard";
import { OrderDto } from "./dtos/order.dto";
import { CreateOrdersDto } from "./dtos/create-orders.dto";
import { FilterOrdersDto } from "./dtos/filter-orders.dto";

@Controller("/orders")
@ApiTags("Orders")
export class OrdersController {
  constructor(private __ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Place many orders" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: [OrderDto] })
  @ApiResponse({
    status: 400,
    description:
      "\n1. Invalid request message" +
      "\n2. Invalid startDate/endDate  \n" +
      "\n3. Hired days is too short \n" +
      "\n4. Out of stock \n",
  })
  @ApiResponse({ status: 404, description: "Not found product | address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async createOrders(@Request() req, @Body() input: CreateOrdersDto): Promise<OrderDto[]> {
    const result = await this.__ordersService.createOrders(input, req.user);
    return plainToClass(OrderDto, result);
  }

  @Get()
  public async filterOrders(@Query() input: FilterOrdersDto) {
    const result = await this.__ordersService.filterOrders(
      {
        productId: input.productId,
        lessorId: input.lessorId,
        lesseeId: input.lesseeId,
        status: input.status,
      },
      {
        limit: input.limit,
        page: input.page,
        sort: input.sort,
        populate: input.populate,
      },
    );
    return result;
  }
}
