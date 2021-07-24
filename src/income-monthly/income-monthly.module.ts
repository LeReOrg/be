import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IncomeMonthly, IncomeMonthlySchema } from "./schemas/income-monthly.schema";
import { IncomeMonthlyRepository } from "./income-monthly.repository";
import { IncomeMonthlyService } from "./income-monthly.service";
import { IncomeMonthlyController } from "./income-monthly.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: IncomeMonthly.name,
        useFactory: () => {
          const schema = IncomeMonthlySchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [IncomeMonthlyController],
  providers: [IncomeMonthlyRepository, IncomeMonthlyService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: IncomeMonthly.name,
        useFactory: () => {
          const schema = IncomeMonthlySchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    IncomeMonthlyRepository,
    IncomeMonthlyService,
  ],
})
export class IncomeMonthlyModule {}
