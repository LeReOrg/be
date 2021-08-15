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
import { IncomesService } from "../incomes/incomes.service";
import { IncomeMonthlyService } from "../income-monthly/income-monthly.service";
import { BalancesService } from "../balances/balances.service";

@Injectable()
export class OrdersService {
  private orderPopulate: any[] = [
    { path: "detail", populate: { path: "product" } },
    "lessor",
    "lessorAddress",
    "lessee",
    "lesseeAddress",
  ];

  constructor(
    private ordersRepository: OrdersRepository,
    private productsRepository: ProductsRepository,
    private addressesRepository: AddressesRepository,
    private orderDetailsRepository: OrderDetailsRepository,
    private incomesService: IncomesService,
    private incomeMonthlyService: IncomeMonthlyService,
    private balancesService: BalancesService,
  ) {
    this.runAutoUpdateOverHiredDateOrdersStatus();
  }

  // If startDate are same as endDate consider it is a full day
  private calculateHiredDays(startDate: Date, endDate: Date): number {
    return moment(endDate).diff(startDate, "days") + 1;
  }

  // Discounts already sorted by "days" before save to database
  private selectProductDiscount(discounts: Discount[], hiredDays: number): Discount | undefined {
    const matchedDiscounts = discounts.filter((discount) => hiredDays >= discount.days);
    return matchedDiscounts[matchedDiscounts.length - 1];
  }

  private calculateOrderAmount(
    price: number,
    hiredDays: number,
    quantity: number,
    discountRate: number,
  ): number {
    const amount = price * quantity * hiredDays;

    const appliedDiscountAmount = amount - (amount * discountRate) / 100;

    return appliedDiscountAmount;
  }

  private calculateOrderDeposit(unitDeposit: number, quantity: number): number {
    return unitDeposit * quantity;
  }

  private isValidQuantity(orderQuantity: number, productQuantity: number): boolean {
    return orderQuantity <= productQuantity;
  }

  private isValidStartDateAndEndDate(startDate: Date, endDate: Date): boolean {
    return endDate >= startDate;
  }

  private isValidHiredDays(hiredDays: number, shortestAllowedHiredDays: number): boolean {
    return hiredDays >= shortestAllowedHiredDays;
  }

  private checkOrderQuantity(orderQuantity: number, productQuantity: number): void {
    const isValidQuantity = this.isValidQuantity(orderQuantity, productQuantity);

    if (!isValidQuantity) {
      throw new BadRequestException("Out of stock");
    }
  }

  private checkOrderStartDateAndEndDate(startDate: Date, endDate: Date): void {
    const isValidDates = this.isValidStartDateAndEndDate(startDate, endDate);

    if (!isValidDates) {
      throw new BadRequestException("Invalid startDate/endDate");
    }
  }

  private checkHiredDays(hiredDays: number, shortestAllowedHiredDays: number): void {
    const isValidHiredDays = this.isValidHiredDays(hiredDays, shortestAllowedHiredDays);

    if (!isValidHiredDays) {
      throw new BadRequestException("Hired days is shorter than product shortest hired days");
    }
  }

  private async validateCreateOrdersInput(
    input: CreateOrdersDto,
    user: User,
  ): Promise<{
    products: Product[];
    address: Address;
  }> {
    const orders = input.orders;

    const productIds = orders.map((order) => order.productId);

    const address = await this.addressesRepository.findOne({
      _id: input.addressId,
      user,
    });

    if (!address) {
      throw new NotFoundException("Not Found Address");
    }

    const products = await this.productsRepository.findAll(
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

      this.checkOrderStartDateAndEndDate(startDate, endDate);

      const hiredDays = this.calculateHiredDays(startDate, endDate);
      this.checkHiredDays(hiredDays, product.shortestHiredDays);

      this.checkOrderQuantity(quantity, product.quantity);
    }

    return { products, address };
  }

  public async createOrders(input: CreateOrdersDto, user: User): Promise<Order[]> {
    const { products, address } = await this.validateCreateOrdersInput(input, user);

    return Promise.all(
      input.orders.map(async (data) => {
        // Always have value since already checked above
        const product = products.find((item) => item.id === data.productId) as Product;

        const hiredDays = this.calculateHiredDays(data.startDate, data.endDate);

        const appliedDiscount = this.selectProductDiscount(product.discounts || [], hiredDays);

        const amount = this.calculateOrderAmount(
          product.price,
          hiredDays,
          data.quantity,
          appliedDiscount?.discount || 0,
        );

        const deposit = this.calculateOrderDeposit(product.depositPrice, data.quantity);

        const lessorAddress = product.address;
        const lesseeAddress = address;

        const detail = await this.orderDetailsRepository.createOne({
          product: product,
          name: product.name,
          quantity: data.quantity,
          unitPrice: product.price,
          unitDeposit: product.depositPrice,
          discount: appliedDiscount,
          thumbnail: product.images[0],
        });

        return this.ordersRepository.createOne({
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

    return this.ordersRepository.paginate(conditions, options);
  }

  private isLesseeOfOrder(user: User, order: Order): boolean {
    return user.id === order.lessee.id;
  }

  private isPendingConfirmOrder(status: string): boolean {
    return status === OrderStatus.PendingConfirm;
  }

  private checkPermissionToUpdatePendingConfirmOrder(user: User, order: Order): void {
    const isLesseeOfOrder = this.isLesseeOfOrder(user, order);

    if (!isLesseeOfOrder) {
      throw new ForbiddenException("User is not lessee");
    }

    const isPendingConfirmOrder = this.isPendingConfirmOrder(order.status);

    if (!isPendingConfirmOrder) {
      throw new ForbiddenException(`Can not modify order with status \t"${order.status}"\t`);
    }
  }

  public async findOrderDetailById(id: any): Promise<Order> {
    return this.ordersRepository.findByIdOrThrowException(id, undefined, {
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
    const order = await this.ordersRepository.findByIdOrThrowException(id, undefined, {
      populate: [{ path: "detail", populate: { path: "product" } }, { path: "lessee" }],
    });

    this.checkPermissionToUpdatePendingConfirmOrder(user, order);

    const { quantity, startDate, endDate, addressId } = input;
    const { detail } = order;
    const { product } = detail;

    const updatedOrder: Partial<Order> = {};
    const updatedDetail: Partial<OrderDetail> = {};

    if (addressId) {
      updatedOrder.lesseeAddress = await this.addressesRepository.findByIdOrThrowException(
        addressId,
      );
    }

    if (startDate || endDate) {
      const calculatedStartDate = startDate || order.startDate;
      const calculatedEndDate = endDate || order.endDate;

      this.checkOrderStartDateAndEndDate(calculatedStartDate, calculatedEndDate);

      const hiredDays = this.calculateHiredDays(calculatedStartDate, calculatedEndDate);
      this.checkHiredDays(hiredDays, product.shortestHiredDays);

      updatedOrder.startDate = calculatedStartDate;
      updatedOrder.endDate = calculatedEndDate;
      updatedOrder.hiredDays = hiredDays;

      updatedDetail.discount = this.selectProductDiscount(product.discounts || [], hiredDays);
    }

    if (quantity) {
      this.checkOrderQuantity(quantity, product.quantity);

      updatedOrder.deposit = this.calculateOrderDeposit(
        detail.unitDeposit,
        quantity || order.detail.quantity,
      );

      updatedDetail.quantity = quantity;
    }

    const discountRate =
      startDate || endDate ? updatedDetail.discount?.discount : order.detail.discount?.discount;

    updatedOrder.amount = this.calculateOrderAmount(
      product.price,
      updatedOrder.hiredDays || order.hiredDays,
      quantity || order.detail.quantity,
      discountRate || 0,
    );

    await Promise.all([
      this.orderDetailsRepository.updateOne({ _id: detail._id }, updatedDetail),
      this.ordersRepository.updateOne({ _id: order._id }, updatedOrder),
    ]);

    return this.findOrderDetailById(id);
  }

  private isLessorOfOrder(user: User, order: Order): boolean {
    return user.id === order.lessor.id;
  }

  private isOutdatedOrder(orderStartDate: Date): boolean {
    const now = moment();
    const startDate = moment(orderStartDate);
    return startDate.isBefore(now, "day");
  }

  private checkPermissionToConfirmOrder(user: User, order: Order): void {
    const isLessorOfOrder = this.isLessorOfOrder(user, order);
    if (!isLessorOfOrder) {
      throw new ForbiddenException("User is not lessor");
    }

    const isPendingConfirmOrder = this.isPendingConfirmOrder(order.status);
    if (!isPendingConfirmOrder) {
      throw new ForbiddenException(`Can only confirm ${OrderStatus.PendingConfirm} order`);
    }

    const isOutDated = this.isOutdatedOrder(order.startDate);
    if (isOutDated) {
      throw new ForbiddenException("Order is outdated");
    }
  }

  public async confirmOrderById(id: any, user: User): Promise<void> {
    const order = await this.findOrderDetailById(id);

    this.checkPermissionToConfirmOrder(user, order);

    const { detail, lessor, lessorAddress, lesseeAddress } = order;
    const { product } = detail;

    // Remove unnecessary address info before duplicate
    const [duplicatedLessorAddress, duplicatedLesseeAddress] = await Promise.all([
      this.addressesRepository.createOne({
        fullName: lessor.displayName,
        phoneNumber: lessor.phoneNumber,
        latitude: lessorAddress.latitude,
        longitude: lessorAddress.longitude,
        street: lessorAddress.street,
        ward: lessorAddress.ward,
        district: lessorAddress.district,
        province: lessorAddress.province,
        order,
      }),
      this.addressesRepository.createOne({
        fullName: lesseeAddress.fullName,
        phoneNumber: lesseeAddress.phoneNumber,
        latitude: lesseeAddress.latitude,
        longitude: lesseeAddress.longitude,
        street: lesseeAddress.street,
        ward: lesseeAddress.ward,
        district: lesseeAddress.district,
        province: lesseeAddress.province,
        order,
      }),
    ]);

    await Promise.all([
      this.productsRepository.updateOne(
        { _id: product._id },
        { $inc: { quantity: -detail.quantity } },
      ),
      this.ordersRepository.updateOne(
        { _id: order._id },
        {
          lessorAddress: duplicatedLessorAddress,
          lesseeAddress: duplicatedLesseeAddress,
          status: OrderStatus.AwaitingPickup,
        },
      ),
    ]);
  }

  private isLessorOrLesseeOfOrder(user: User, order: Order): boolean {
    return this.isLessorOfOrder(user, order) || this.isLesseeOfOrder(user, order);
  }

  private checkPermissionToCancelOrder(user: User, order: Order): void {
    const isLessorOrLesseeOfOrder = this.isLessorOrLesseeOfOrder(user, order);
    if (!isLessorOrLesseeOfOrder) {
      throw new ForbiddenException("User is not lessor or lessee");
    }

    if (order.status !== OrderStatus.PendingConfirm) {
      throw new ForbiddenException(
        `Lessor/Lessee can only cancel ${OrderStatus.PendingConfirm} order`,
      );
    }
  }

  public async cancelOrderById(id: any, user: User): Promise<void> {
    const order = await this.findOrderDetailById(id);

    this.checkPermissionToCancelOrder(user, order);

    await this.ordersRepository.updateOne({ _id: order._id }, { status: OrderStatus.Cancelled });
  }

  public async updateOrderStatusById(id: any, status: string): Promise<void> {
    const order = await this.findOrderDetailById(id);

    if (
      (status === OrderStatus.Delivered && order.status !== OrderStatus.Delivering) ||
      (status === OrderStatus.AwaitingReturnPickup && order.status !== OrderStatus.Delivered) ||
      (status === OrderStatus.Returning && order.status !== OrderStatus.AwaitingReturnPickup)
    ) {
      throw new ForbiddenException(`Order status is not valid`);
    }

    return this.ordersRepository.updateOne({ _id: order._id }, { status });
  }

  public async deliveryOrderById(id: any): Promise<void> {
    const order = await this.ordersRepository.findByIdOrThrowException(id);

    if (order.status !== OrderStatus.AwaitingPickup) {
      throw new ForbiddenException(`Order status must be ${OrderStatus.AwaitingPickup}`);
    }

    const [result, income] = await Promise.all([
      this.ordersRepository.updateOne({ _id: order._id }, { status: OrderStatus.Delivering }),
      this.incomesService.createIncomeFromOrderForLessor(order),
    ]);

    await Promise.all([
      this.incomeMonthlyService.increaseUserIncomeMonthly(
        order.lessor,
        income.createdAt,
        income.lessorEarned,
      ),
      this.balancesService.increaseUserBalance(income.lessorEarned, order.lessor),
    ]);

    return result;
  }

  public async confirmReturnedOrderById(id: any): Promise<void> {
    const order = await this.ordersRepository.findByIdOrThrowException(id, null, {
      populate: { path: "detail", populate: { path: "product" } },
    });

    if (order.status !== OrderStatus.Returning) {
      throw new ForbiddenException(`Order status must be ${OrderStatus.Returning}`);
    }

    await Promise.all([
      this.productsRepository.updateOne(
        { _id: order.detail.product._id },
        { $inc: { quantity: order.detail.quantity } },
      ),
      this.ordersRepository.findByIdAndUpdate(
        id,
        { status: OrderStatus.Returned },
        { populate: this.orderPopulate },
      ),
    ]);
  }

  public async updateOverHiredDateOrdersStatus(): Promise<void> {
    return this.ordersRepository.updateMany(
      {
        status: OrderStatus.Delivered,
        endDate: { $lt: new Date() },
      },
      {
        status: OrderStatus.AwaitingReturnPickup,
      },
    );
  }

  // Auto update every hour
  public async runAutoUpdateOverHiredDateOrdersStatus(): Promise<void> {
    setInterval(() => this.updateOverHiredDateOrdersStatus(), 3600000);
  }
}
