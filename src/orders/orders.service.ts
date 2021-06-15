import * as moment from "moment";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { OrdersRepository } from "./orders.repository";
import { User } from "../users/schemas/user.schema";
import { Order } from "./schemas/order.schema";
import { ProductsRepository } from "../products/products.repository";
import { Product } from "../products/schemas/product.schema";
import { Discount } from "../products/schemas/discount.schema";
import { OrderStatus } from "./enums/order-status";
import { AddressesRepository } from "../addresses/addresses.repository";
import { Address } from "../addresses/schemas/address.schema";
import { CreateOrdersDto } from "./dtos/create-orders.dto";

@Injectable()
export class OrdersService {
  constructor(
    private __ordersRepository: OrdersRepository,
    private __productsRepository: ProductsRepository,
    private __addressesRepository: AddressesRepository,
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

  private async __validateCreateOrdersInput(
    input: CreateOrdersDto,
    lessee: User,
  ): Promise<{
    products: Product[];
    address: Address;
  }> {
    const orders = input.orders;

    const productIds = orders.map((order) => order.productId);

    const [products, address] = await Promise.all([
      this.__productsRepository.findAll({ _id: { $in: productIds } }, undefined, {
        projection: { images: { $slice: 1 } },
        populate: ["user", "address"],
      }),
      this.__addressesRepository.findOne({
        _id: input.address,
        user: lessee,
        isShippingAddress: true,
      }),
    ]);

    if (!address) {
      throw new BadRequestException("Not Found Lessee Address");
    }

    for (const order of orders) {
      const { productId, startDate, endDate, quantity } = order;

      const product = products.find((item) => item.id === productId);

      if (!product) {
        throw new NotFoundException("Not Found Product " + productId);
      }

      if (!product.address) {
        // Product should always have address
        throw new InternalServerErrorException("Not Found Product Address");
      }

      if (endDate < startDate) {
        throw new BadRequestException("Invalid startDate/endDate");
      }

      const hiredDays = this.__calculateHiredDays(startDate, endDate);

      if (hiredDays < product.shortestHiredDays) {
        throw new BadRequestException("Hired days is shorter than product shortest hired days");
      }

      if (quantity > product.quantity) {
        throw new BadRequestException("Out of stock");
      }
    }

    return { products, address };
  }

  public async createOrders(input: CreateOrdersDto, lessee: User): Promise<Order[]> {
    const { products, address: lesseeAddress } = await this.__validateCreateOrdersInput(
      input,
      lessee,
    );

    const payloads: Partial<Order>[] = [];

    for (const data of input.orders) {
      const product = products.find((item) => item.id === data.productId);

      if (!product) {
        throw new InternalServerErrorException("Create failed");
      }

      const hiredDays = this.__calculateHiredDays(data.startDate, data.endDate);

      const discountRateBasedOnHiredDays = this.__calculateHiredDaysDiscountRate(
        product.discounts || [],
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

      const payload: Partial<Order> = {
        product,
        lessor: product.user,
        lessee,
        lesseeAddress,
        lessorAddress: product.address,
        thumbnailUrl,
        quantity: data.quantity,
        amount,
        deposit,
        hiredDays,
        startDate: data.startDate,
        endDate: data.endDate,
        status: OrderStatus.PendingConfirm,
      };

      payloads.push(payload);
    }

    return this.__ordersRepository.createMany(payloads);
  }

  // private __validateOnSetOrderStatus(currentStatus: string, newStatus: string): void {
  //   if (
  //     !currentStatus ||
  //     !newStatus ||
  //     (newStatus === OrderStatus.AwaitingPickup && currentStatus !== OrderStatus.PendingConfirm) ||
  //     (newStatus === OrderStatus.Delivering && currentStatus !== OrderStatus.AwaitingPickup) ||
  //     (newStatus === OrderStatus.Delivered && currentStatus !== OrderStatus.Delivering) ||
  //     (newStatus === OrderStatus.AwaitingReturnPickup && currentStatus !== OrderStatus.Delivered) ||
  //     (newStatus === OrderStatus.Returning && currentStatus !== OrderStatus.AwaitingReturnPickup) ||
  //     (newStatus === OrderStatus.Returned && currentStatus !== OrderStatus.Returning) ||
  //     // Only allow cancel the order before delivery
  //     (newStatus === OrderStatus.Cancelled && currentStatus !== OrderStatus.PendingConfirm) ||
  //     (newStatus === OrderStatus.Cancelled && currentStatus !== OrderStatus.AwaitingReturnPickup)
  //   ) {
  //     throw new Error("Invalid Status");
  //   }
  // }

  // public async updateOrder(id: string, input: any) {
  //   const order = await this.__ordersRepository.findByIdOrThrowException(id);

  //   const payload: Partial<Order> = {};

  //   if (input.quantity) {
  //     payload.quantity = input.quantity;
  //   }

  //   // if (input.status) {
  //   //   this.__validateOnSetOrderStatus(order.status, input.status.toUpperCase());
  //   //   payload.status = input.status;
  //   // }
  // }
}
