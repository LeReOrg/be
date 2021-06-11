import * as paginate from "mongoose-paginate-v2";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./products.repository";
import { UsersModule } from "../users/users.module";
import { CategoriesModule } from "../categories/categories.module";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Product.name,
        useFactory: () => {
          const schema = ProductSchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    ProductsService,
    ProductsRepository,
  ],
})
export class ProductsModule {}
