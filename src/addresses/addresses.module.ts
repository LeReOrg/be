import * as paginate from "mongoose-paginate-v2";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Address, AddressSchema } from "./schemas/address.schema";
import { AddressesRepository } from "./addresses.repository";
import { AddressesService } from "./addresses.service";
import { UserAddressesController } from "./user-addresses.controller";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Address.name,
        useFactory: () => {
          const schema = AddressSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
  ],
  controllers: [UserAddressesController],
  providers: [AddressesRepository, AddressesService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Address.name,
        useFactory: () => {
          const schema = AddressSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    AddressesRepository,
    AddressesService,
  ],
})
export class AddressesModule {}
