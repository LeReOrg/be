import * as moment from "moment";
import {
  BadRequestException,
  ForbiddenException,
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
import { OrderDetailsRepository } from "../order-details/order-details.repository";
import { UpdateOrderDto } from "./dtos/update-order.dto";
import { OrderDetail } from "../order-details/schemas/order-detail.schema";
import { OrderPopulate } from "./enums/order-populate";

@Injectable()
export class OrdersService {
  constructor(
    private __ordersRepository: OrdersRepository,
    private __productsRepository: ProductsRepository,
    private __addressesRepository: AddressesRepository,
    private __orderDetailsRepository: OrderDetailsRepository,
  ) {}

  // If startDate are same as endDate consider it is a full day
  private __calculateHiredDays(startDate: Date, endDate: Date): number {
    return moment(endDate).diff(startDate, "days") + 1;
  }

  // Discounts already sorted by "days" before save to database
  private __selectProductDiscount(discounts: Discount[], hiredDays: number): Discount | undefined {
    const matchedDiscounts = discounts.filter((discount) => hiredDays >= discount.days);
    return matchedDiscounts[matchedDiscounts.length - 1];
  }

  private __calculateOrderAmount(
    price: number,
    hiredDays: number,
    quantity: number,
    discountRate: number,
  ): number {
    const amount = price * quantity * hiredDays;

    const appliedDiscountAmount = amount - (amount * discountRate) / 100;

    return appliedDiscountAmount;
  }

  private __calculateOrderDeposit(unitDeposit: number, quantity: number): number {
    return unitDeposit * quantity;
  }

  private __isValidQuantity(orderQuantity: number, productQuantity: number): boolean {
    return orderQuantity <= productQuantity;
  }

  private __isValidStartDateAndEndDate(startDate: Date, endDate: Date): boolean {
    return endDate >= startDate;
  }

  private __isValidHiredDays(hiredDays: number, shortestAllowedHiredDays: number): boolean {
    return hiredDays >= shortestAllowedHiredDays;
  }

  private __checkOrderQuantity(orderQuantity: number, productQuantity: number): void {
    const isValidQuantity = this.__isValidQuantity(orderQuantity, productQuantity);

    if (!isValidQuantity) {
      throw new BadRequestException("Out of stock");
    }
  }

  private __checkOrderStartDateAndEndDate(startDate: Date, endDate: Date): void {
    const isValidDates = this.__isValidStartDateAndEndDate(startDate, endDate);

    if (!isValidDates) {
      throw new BadRequestException("Invalid startDate/endDate");
    }
  }

  private __checkHiredDays(hiredDays: number, shortestAllowedHiredDays: number): void {
    const isValidHiredDays = this.__isValidHiredDays(hiredDays, shortestAllowedHiredDays);

    if (!isValidHiredDays) {
      throw new BadRequestException("Hired days is shorter than product shortest hired days");
    }
  }

  private async __validateCreateOrdersInput(input: CreateOrdersDto): Promise<{
    products: Product[];
    address: Address;
  }> {
    const orders = input.orders;

    const productIds = orders.map((order) => order.productId);

    const address = await this.__addressesRepository.findByIdOrThrowException(input.addressId);

    const products = await this.__productsRepository.findAll(
      { _id: { $in: productIds } },
      undefined,
      {
        projection: { images: { $slice: 1 } },
        populate: ["user", "address"],
      },
    );

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

      this.__checkOrderStartDateAndEndDate(startDate, endDate);

      const hiredDays = this.__calculateHiredDays(startDate, endDate);
      this.__checkHiredDays(hiredDays, product.shortestHiredDays);

      this.__checkOrderQuantity(quantity, product.quantity);
    }

    return { products, address };
  }

  public async createUserOrders(input: CreateOrdersDto, user: User): Promise<Order[]> {
    const { products, address } = await this.__validateCreateOrdersInput(input);

    return Promise.all(
      input.orders.map(async (data) => {
        // Always have value since already checked above
        const product = products.find((item) => item.id === data.productId) as Product;

        const hiredDays = this.__calculateHiredDays(data.startDate, data.endDate);

        const appliedDiscount = this.__selectProductDiscount(product.discounts || [], hiredDays);

        const amount = this.__calculateOrderAmount(
          product.price,
          hiredDays,
          data.quantity,
          appliedDiscount?.discount || 0,
        );

        const deposit = this.__calculateOrderDeposit(product.depositPrice, data.quantity);

        const lessorAddress = product.address;
        const lesseeAddress = address;

        const detail = await this.__orderDetailsRepository.createOne({
          product: product,
          name: product.name,
          quantity: data.quantity,
          unitPrice: product.price,
          unitDeposit: product.depositPrice,
          discount: appliedDiscount,
          thumbnail: product.images[0],
        });

        return this.__ordersRepository.createOne({
          detail,
          lessor: product.user,
          lessee: user,
          lessorAddress,
          lesseeAddress,
          amount,
          deposit,
          hiredDays,
          startDate: data.startDate,
          endDate: data.endDate,
          status: OrderStatus.PendingConfirm,
        });
      }),
    );
  }

  public async filterOrders(
    filters: {
      lessorId?: string;
      lesseeId?: string;
      startDate?: Date;
      endDate?: Date;
      status?: string;
    },
    options: {
      limit: number;
      page: number;
      sort?: any;
      populate?: any[];
    },
  ) {
    const conditions: any = {};

    if (filters) {
      const { lessorId, lesseeId, status } = filters;

      if (lessorId) {
        conditions.lessor = lessorId;
      }
      if (lesseeId) {
        conditions.lessee = lesseeId;
      }
      if (status) {
        conditions.status = status;
      }
    }

    if (options) {
      const { populate } = options;

      if (Array.isArray(populate) && populate.length && populate.includes(OrderPopulate.Product)) {
        const index = populate.indexOf(OrderPopulate.Product);
        populate[index] = { path: "detail", populate: { path: "product" } };
      }
    }

    return this.__ordersRepository.paginate(conditions, options);
  }

  private __isLesseeOfOrder(user: User, order: Order): boolean {
    return user.id === order.lessee.id;
  }

  private __isPendingConfirmOrder(status: string): boolean {
    return status === OrderStatus.PendingConfirm;
  }

  private __checkPermissionToUpdatePendingConfirmOrder(user: User, order: Order): void {
    const isPendingConfirmOrder = this.__isPendingConfirmOrder(order.status);

    if (!isPendingConfirmOrder) {
      throw new ForbiddenException(`Can not modify order with status \t"${order.status}"\t`);
    }

    const isOwnThisOrder = this.__isLesseeOfOrder(user, order);

    if (!isOwnThisOrder) {
      throw new ForbiddenException("User do not own this order");
    }
  }

  public async findOrderDetailById(id: any): Promise<Order> {
    return this.__ordersRepository.findByIdOrThrowException(id, undefined, {
      populate: [
        { path: "detail", populate: { path: "product" } },
        "lessor",
        "lessorAddress",
        "lessee",
        "lesseeAddress",
      ],
    });
  }

  public async updateUserOrderById(id: any, input: UpdateOrderDto, user: User) {
    const order = await this.__ordersRepository.findByIdOrThrowException(id, undefined, {
      populate: [{ path: "detail", populate: { path: "product" } }, { path: "lessee" }],
    });

    this.__checkPermissionToUpdatePendingConfirmOrder(user, order);

    const { quantity, startDate, endDate, addressId } = input;
    const { detail } = order;
    const { product } = detail;

    const updatedOrder: Partial<Order> = {};
    const updatedDetail: Partial<OrderDetail> = {};

    if (addressId) {
      updatedOrder.lesseeAddress = await this.__addressesRepository.findByIdOrThrowException(
        addressId,
      );
    }

    if (startDate || endDate) {
      const calculatedStartDate = startDate || order.startDate;
      const calculatedEndDate = endDate || order.endDate;

      this.__checkOrderStartDateAndEndDate(calculatedStartDate, calculatedEndDate);

      const hiredDays = this.__calculateHiredDays(calculatedStartDate, calculatedEndDate);
      this.__checkHiredDays(hiredDays, product.shortestHiredDays);

      updatedOrder.startDate = calculatedStartDate;
      updatedOrder.endDate = calculatedEndDate;
      updatedOrder.hiredDays = hiredDays;

      updatedDetail.discount = this.__selectProductDiscount(product.discounts || [], hiredDays);
    }

    if (quantity) {
      this.__checkOrderQuantity(quantity, product.quantity);

      updatedOrder.deposit = this.__calculateOrderDeposit(
        detail.unitDeposit,
        quantity || order.detail.quantity,
      );

      updatedDetail.quantity = quantity;
    }

    const discountRate =
      startDate || endDate ? updatedDetail.discount?.discount : order.detail.discount?.discount;

    updatedOrder.amount = this.__calculateOrderAmount(
      product.price,
      updatedOrder.hiredDays || order.hiredDays,
      quantity || order.detail.quantity,
      discountRate || 0,
    );

    await Promise.all([
      this.__orderDetailsRepository.updateOne({ _id: detail._id }, updatedDetail),
      this.__ordersRepository.updateOne({ _id: order._id }, updatedOrder),
    ]);

    return this.findOrderDetailById(id);
  }

  // this.__addressesRepository.createOne({
  //   latitude: product.address?.latitude,
  //   longitude: product.address?.longitude,
  //   street: product.address?.street,
  //   ward: product.address?.ward,
  //   district: product.address?.district,
  //   province: product.address?.province,
  // }),
  // this.__addressesRepository.createOne({
  //   latitude: address.latitude,
  //   longitude: address.longitude,
  //   street: address.street,
  //   ward: address.ward,
  //   district: address.district,
  //   province: address.province,
  // }),

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
