import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomeFee, IncomeFeeSchema } from "./schemas/income-fee.schema";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: IncomeFee.name,
        useFactory: () => {
          const schema = IncomeFeeSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: IncomeFee.name,
        useFactory: () => {
          const schema = IncomeFeeSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
})
export class IncomeFeesModule {}
