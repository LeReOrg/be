import * as paginate from "mongoose-paginate-v2";
import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schemas/category.schema";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { CategoriesRepository } from "./categories.repository";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    CloudinaryModule,
    forwardRef(() => ProductsModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
  exports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          schema.plugin(paginate);
          return schema;
        },
      },
    ]),
    CategoriesService,
    CategoriesRepository,
  ],
})
export class CategoriesModule {}
