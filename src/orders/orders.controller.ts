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
import { UpdateOrderDto } from "./dtos/update-order.dto";
import { FilterOrdersDto } from "./dtos/filter-orders.dto";
import { OrderStatus } from "./enums/order-status";
import { OkResponseBodyDto } from "../common/dtos/ok.response.dto";

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
  @ApiOperation({ summary: "Filter orders" })
  @ApiExtraModels(OrderDto, PaginatedDto)
  @ApiPaginatedResponse(OrderDto)
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async filterOrders(@Query() input: FilterOrdersDto): Promise<PaginatedDto<OrderDto>> {
    const result = await this.__ordersService.filterOrders(
      {
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
    return plainToClassFromExist(new PaginatedDto<OrderDto>(OrderDto), result);
  }

  @Get("/:id")
  @ApiOperation({ summary: "Find order detail by id" })
  @ApiResponse({ status: 200, type: OrderDto })
  @ApiResponse({ status: 404, description: "Not Found Order" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async findOrderDetailById(@Param("id") id: string): Promise<OrderDto> {
    const result = await this.__ordersService.findOrderDetailById(id);
    return plainToClass(OrderDto, result);
  }

  @Patch("/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Update an order by id",
    description: "Only allow to update before lessor confirm",
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OrderDto })
  @ApiResponse({
    status: 400,
    description:
      "\n1. Invalid request message" +
      "\n2. Invalid startDate/endDate \n" +
      "\n3. Hired days is too short \n" +
      "\n4. Out of stock \n",
  })
  @ApiResponse({
    status: 403,
    description: `\n1. User is not lessee \n2. Order status is not ${OrderStatus.PendingConfirm}`,
  })
  @ApiResponse({ status: 404, description: "Not found order | address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateOrderById(
    @Request() req,
    @Param("id") id: string,
    @Body() input: UpdateOrderDto,
  ): Promise<OrderDto> {
    const result = await this.__ordersService.updateOrderById(id, input, req.user);
    return plainToClass(OrderDto, result);
  }

  @Post("/:id/confirm")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Confirm an order by id",
    description: "Can only perform by lessor",
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({
    status: 403,
    description:
      "1. User is not lessor" +
      `\n2. Order status is not ${OrderStatus.PendingConfirm}` +
      "\n3. Order is outdated (startDate < now)",
  })
  @ApiResponse({ status: 404, description: "Not found order" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async confirmOrderById(@Request() req, @Param("id") id: string) {
    await this.__ordersService.confirmOrderById(id, req.user);
    return { status: "OK" };
  }

  @Post("/:id/cancel")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Cancel an order by id",
    description: `Lessor and Lessee can only cancel ${OrderStatus.PendingConfirm} order`,
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: OkResponseBodyDto })
  @ApiResponse({ status: 400, description: "Invalid request message" })
  @ApiResponse({
    status: 403,
    description: `1. User is not lessor/lessee \n2. Order status is not ${OrderStatus.PendingConfirm}`,
  })
  @ApiResponse({ status: 404, description: "Not found order" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async cancelOrderById(@Request() req, @Param("id") id: string) {
    await this.__ordersService.cancelOrderById(id, req.user);
    return { status: "OK" };
  }
}
