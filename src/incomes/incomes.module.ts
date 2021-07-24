import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Income, IncomeSchema } from "./schemas/income.schema";
import { IncomesRepository } from "./incomes.repository";
import { IncomesService } from "./incomes.service";
import { IncomeFeesModule } from "../income-fees/income-fees.module";
import { IncomesController } from "./incomes.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Income.name,
        useFactory: () => {
          const schema = IncomeSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    IncomeFeesModule,
  ],
  controllers: [IncomesController],
  providers: [IncomesRepository, IncomesService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Income.name,
        useFactory: () => {
          const schema = IncomeSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    IncomesRepository,
    IncomesService,
  ],
})
export class IncomesModule {}
