import * as paginate from "mongoose-paginate-v2";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    forwardRef(() => ProductsModule),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    UsersRepository,
    UsersService,
  ],
})
export class UsersModule {}
