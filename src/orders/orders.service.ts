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
  private __orderPopulate: any[] = [
    { path: "detail", populate: { path: "product" } },
    "lessor",
    "lessorAddress",
    "lessee",
    "lesseeAddress",
  ];

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

  public async createOrders(input: CreateOrdersDto, user: User): Promise<Order[]> {
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
    const isLesseeOfOrder = this.__isLesseeOfOrder(user, order);

    if (!isLesseeOfOrder) {
      throw new ForbiddenException("User is not lessee");
    }

    const isPendingConfirmOrder = this.__isPendingConfirmOrder(order.status);

    if (!isPendingConfirmOrder) {
      throw new ForbiddenException(`Can not modify order with status \t"${order.status}"\t`);
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

  public async updateOrderById(id: any, input: UpdateOrderDto, user: User): Promise<Order> {
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

  private __isLessorOfOrder(user: User, order: Order): boolean {
    return user.id === order.lessor.id;
  }

  private __isOutdatedOrder(orderStartDate: Date): boolean {
    const now = moment();
    const startDate = moment(orderStartDate);
    return startDate.isBefore(now, "day");
  }

  private __checkPermissionToConfirmOrder(user: User, order: Order): void {
    const isLessorOfOrder = this.__isLessorOfOrder(user, order);
    if (!isLessorOfOrder) {
      throw new ForbiddenException("User is not lessor");
    }

    const isPendingConfirmOrder = this.__isPendingConfirmOrder(order.status);
    if (!isPendingConfirmOrder) {
      throw new ForbiddenException(`Can only confirm ${OrderStatus.PendingConfirm} order`);
    }

    const isOutDated = this.__isOutdatedOrder(order.startDate);
    if (isOutDated) {
      throw new ForbiddenException("Order is outdated");
    }
  }

  private async __duplicatedOrderAddress(originalAddress: Address): Promise<Address> {
    return this.__addressesRepository.createOne({
      fullName: originalAddress.fullName,
      phoneNumber: originalAddress.phoneNumber,
      latitude: originalAddress.latitude,
      longitude: originalAddress.longitude,
      street: originalAddress.street,
      ward: originalAddress.ward,
      district: originalAddress.district,
      province: originalAddress.province,
    });
  }

  public async confirmOrderById(id: any, user: User): Promise<void> {
    const order = await this.findOrderDetailById(id);

    this.__checkPermissionToConfirmOrder(user, order);

    const { detail, lessorAddress, lesseeAddress } = order;
    const { product } = detail;

    // Remove unnecessary address info before duplicate
    const [duplicatedLessorAddress, duplicatedLesseeAddress] = await Promise.all([
      this.__duplicatedOrderAddress(lessorAddress),
      this.__duplicatedOrderAddress(lesseeAddress),
    ]);

    await Promise.all([
      this.__productsRepository.updateOne(
        { _id: product._id },
        { $inc: { quantity: -detail.quantity } },
      ),
      this.__ordersRepository.updateOne(
        { _id: order._id },
        {
          lessorAddress: duplicatedLessorAddress,
          lesseeAddress: duplicatedLesseeAddress,
          status: OrderStatus.AwaitingPickup,
        },
      ),
    ]);
  }

  private __isLessorOrLesseeOfOrder(user: User, order: Order): boolean {
    return this.__isLessorOfOrder(user, order) || this.__isLesseeOfOrder(user, order);
  }

  private __checkPermissionToCancelOrder(user: User, order: Order): void {
    const isLessorOrLesseeOfOrder = this.__isLessorOrLesseeOfOrder(user, order);
    if (!isLessorOrLesseeOfOrder) {
      throw new ForbiddenException("User is not lessor or lessee");
    }

    if (order.status !== OrderStatus.PendingConfirm) {
      throw new ForbiddenException(
        `Lessor/Lessee can only cancel ${OrderStatus.PendingConfirm} order`,
      );
    }
  }

  public async cancelOrderById(id: any, user: User): Promise<Order> {
    const order = await this.findOrderDetailById(id);

    this.__checkPermissionToCancelOrder(user, order);

    return this.__ordersRepository.findByIdAndUpdate(
      id,
      { status: OrderStatus.Cancelled },
      { populate: this.__orderPopulate },
    );
  }

  public async updateOrderStatusById(id: any, status: string): Promise<Order> {
    const order = await this.findOrderDetailById(id);
    if (
      (status === OrderStatus.Delivering && order.status !== OrderStatus.AwaitingPickup) ||
      (status === OrderStatus.Delivered && order.status !== OrderStatus.Delivering) ||
      (status === OrderStatus.AwaitingReturnPickup && order.status !== OrderStatus.Delivered) ||
      (status === OrderStatus.Returning && order.status !== OrderStatus.AwaitingReturnPickup) ||
      (status === OrderStatus.Returned && order.status !== OrderStatus.Returning)
    ) {
      throw new ForbiddenException(`Order status is not valid`);
    }
    const populate = this.__orderPopulate;
    return this.__ordersRepository.findByIdAndUpdate(id, { status }, { populate });
  }
}
