import * as moment from "moment";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { User } from "../users/schemas/user.schema";
import { Order } from "./schemas/order.schema";
import { ProductsRepository } from "../products/products.repository";
import { Product } from "../products/schemas/product.schema";
import { Discount } from "../products/schemas/discount.schema";
import { OrderStatus } from "./enums/order-status";

@Injectable()
export class OrdersService {
  constructor(
    private __ordersRepository: OrdersRepository,
    private __productsRepository: ProductsRepository,
  ) {}

  // If startDate are same as endDate consider it equal 1 day
  private __calculateHiredDays(startDate: Date, endDate: Date): number {
    return moment(endDate).diff(startDate, "days") + 1;
  }

  private __calculateHiredDaysDiscountRate(
    productDiscounts: Discount[],
    hiredDays: number,
  ): number {
    let rate = 0;

    for (const data of productDiscounts) {
      if (hiredDays >= data.days) {
        rate = data.discount;
      }
    }

    return rate;
  }

  private __calculateAmount(
    price: number,
    hiredDays: number,
    quantity: number,
    discountRateBasedOnHiredDays: number,
  ): number {
    const amount = price * quantity * hiredDays;

    const appliedDiscountAmount = amount - (amount * discountRateBasedOnHiredDays) / 100;

    return appliedDiscountAmount;
  }

  private __calculateDeposit(depositPerProduct: number, hiredDays: number): number {
    return depositPerProduct * hiredDays;
  }

  private async __validateCreateOrdersInput(input: CreateOrderDto[]): Promise<Product[]> {
    const productIds = input.map((order) => order.productId);

    const products = await this.__productsRepository.findAll(
      { _id: { $in: productIds } },
      undefined,
      {
        projection: { images: { $slice: 1 } },
        populate: "user",
      },
    );

    for (const data of input) {
      const { productId, startDate, endDate, quantity } = data;

      const product = products.find((item) => item.id === productId);

      if (!product) {
        throw new NotFoundException("Not Found Product " + productId);
      }

      if (endDate < startDate) {
        throw new BadRequestException("Invalid startDate/endDate");
      }

      const hiredDays = this.__calculateHiredDays(startDate, endDate);

      if (hiredDays < product.shortestHiredDays) {
        throw new BadRequestException("Hired days is too short");
      }

      if (quantity > product.quantity) {
        throw new BadRequestException("Out of stock");
      }
    }

    return products;
  }

  public async createOrders(input: CreateOrderDto[], lessee: User): Promise<Order[]> {
    const products = await this.__validateCreateOrdersInput(input);

    const orders: Partial<Order>[] = [];

    for (const data of input) {
      const product = products.find((item) => item.id === data.productId);

      if (!product) {
        throw new InternalServerErrorException("Create failed");
      }

      const hiredDays = this.__calculateHiredDays(data.startDate, data.endDate);

      const discountRateBasedOnHiredDays = this.__calculateHiredDaysDiscountRate(
        product.discounts,
        hiredDays,
      );

      const amount = this.__calculateAmount(
        product.price,
        hiredDays,
        data.quantity,
        discountRateBasedOnHiredDays,
      );

      const deposit = this.__calculateDeposit(product.depositPrice, hiredDays);

      const thumbnailUrl = product.images[0].url;

      const order: Partial<Order> = {
        product,
        lessor: product?.user,
        lessee,
        thumbnailUrl,
        quantity: data.quantity,
        amount,
        deposit,
        hiredDays,
        startDate: data.startDate,
        endDate: data.endDate,
        status: OrderStatus.PendingConfirm,
      };

      orders.push(order);
    }

    return this.__ordersRepository.createMany(orders);
  }

  private __validateOnSetOrderStatus(currentStatus: string, newStatus: string): void {
    if (
      !currentStatus ||
      !newStatus ||
      (newStatus === OrderStatus.PickingUp && currentStatus !== OrderStatus.PendingConfirm) ||
      (newStatus === OrderStatus.Delivering && currentStatus !== OrderStatus.PickingUp) ||
      (newStatus === OrderStatus.Delivered && currentStatus !== OrderStatus.Delivering) ||
      (newStatus === OrderStatus.PendingReturn && currentStatus !== OrderStatus.Delivered) ||
      (newStatus === OrderStatus.Returning && currentStatus !== OrderStatus.PendingReturn) ||
      (newStatus === OrderStatus.Returned && currentStatus !== OrderStatus.Returning) ||
      // Only allow cancel the order before delivery
      (newStatus === OrderStatus.Cancelled && currentStatus !== OrderStatus.PendingConfirm) ||
      (newStatus === OrderStatus.Cancelled && currentStatus !== OrderStatus.PickingUp)
    ) {
      throw new Error("Invalid Status");
    }
  }

  public async updateOrder(id: string, input: any) {
    const order = await this.__ordersRepository.findByIdOrThrowException(id);

    const payload: Partial<Order> = {};

    if (input.quantity) {
      payload.quantity = input.quantity;
    }
    if (input.status) {
      this.__validateOnSetOrderStatus(order.status, input.status.toUpperCase());
      payload.status = input.status;
    }
  }
}
