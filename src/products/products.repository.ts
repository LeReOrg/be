import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Product, ProductDocument } from "./schemas/product.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class ProductsRepository extends BaseRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) private __productModel: BaseModel<ProductDocument>) {
    super(__productModel);
  }
}
