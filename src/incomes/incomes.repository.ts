import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Income, IncomeDocument } from "./schemas/income.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class IncomesRepository extends BaseRepository<IncomeDocument> {
  constructor(@InjectModel(Income.name) private incomeModel: BaseModel<IncomeDocument>) {
    super(incomeModel);
  }
}
