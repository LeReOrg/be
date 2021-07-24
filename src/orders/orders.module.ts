import * as paginate from "mongoose-paginate-v2";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { ProductsModule } from "../products/products.module";
import { AddressesModule } from "../addresses/addresses.module";
import { OrderDetailsModule } from "../order-details/order-details.module";
import { IncomesModule } from "../incomes/incomes.module";
import { IncomeMonthlyModule } from "../income-monthly/income-monthly.module";
import { BalancesModule } from "../balances/balances.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    forwardRef(() => ProductsModule),
    forwardRef(() => AddressesModule),
    OrderDetailsModule,
    IncomesModule,
    IncomeMonthlyModule,
    BalancesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    OrdersRepository,
    OrdersService,
  ],
})
export class OrdersModule {}
