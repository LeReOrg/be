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
  public async createUserOrders(
    @Request() req,
    @Body() input: CreateOrdersDto,
  ): Promise<OrderDto[]> {
    const result = await this.__ordersService.createUserOrders(input, req.user);
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
      "\n2. Invalid startDate/endDate  \n" +
      "\n3. Hired days is too short \n" +
      "\n4. Out of stock \n",
  })
  @ApiResponse({ status: 404, description: "Not found order | address" })
  @ApiResponse({ status: 500, description: "Unexpected error happen" })
  public async updateUserOrderById(
    @Request() req,
    @Param("id") id: string,
    @Body() input: UpdateOrderDto,
  ): Promise<OrderDto> {
    const result = await this.__ordersService.updateUserOrderById(id, input, req.user);
    return plainToClass(OrderDto, result);
  }
}
