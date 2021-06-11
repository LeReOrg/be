import * as paginate from "mongoose-paginate-v2";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { OrdersRepository } from "./orders.repository";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { ProductsModule } from "../products/products.module";

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
