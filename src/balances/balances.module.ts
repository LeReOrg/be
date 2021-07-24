import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Balance, BalanceSchema } from "./schemas/balance.schema";
import { BalancesRepository } from "./balances.repository";
import { BalancesService } from "./balances.service";
import { BalancesController } from "./balances.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Balance.name,
        useFactory: () => {
          const schema = BalanceSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [BalancesController],
  providers: [BalancesRepository, BalancesService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Balance.name,
        useFactory: () => {
          const schema = BalanceSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    BalancesRepository,
    BalancesService,
  ],
})
export class BalancesModule {}
