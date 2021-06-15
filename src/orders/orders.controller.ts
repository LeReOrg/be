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
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderDto } from "./dtos/order.dto";
import { CreateOrdersDto } from "./dtos/create-orders.dto";

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
}
