import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Category, CategoryDocument } from "./schemas/category.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class CategoriesRepository extends BaseRepository<CategoryDocument> {
  constructor(@InjectModel(Category.name) private categoryModel: BaseModel<CategoryDocument>) {
    super(categoryModel);
  }
}
