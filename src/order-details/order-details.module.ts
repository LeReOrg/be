import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderDetail, OrderDetailSchema } from "../order-details/schemas/order-detail.schema";
import { OrderDetailsRepository } from "../order-details/order-details.repository";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: OrderDetail.name,
        useFactory: () => {
          const schema = OrderDetailSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [OrderDetailsRepository],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: OrderDetail.name,
        useFactory: () => {
          const schema = OrderDetailSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    OrderDetailsRepository,
  ],
})
export class OrderDetailsModule {}
