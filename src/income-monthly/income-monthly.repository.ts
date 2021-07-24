import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { IncomeMonthly, IncomeMonthlyDocument } from "./schemas/income-monthly.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class IncomeMonthlyRepository extends BaseRepository<IncomeMonthlyDocument> {
  constructor(
    @InjectModel(IncomeMonthly.name) private incomeMonthlyModel: BaseModel<IncomeMonthlyDocument>,
  ) {
    super(incomeMonthlyModel);
  }
}
