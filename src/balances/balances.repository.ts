import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Balance, BalanceDocument } from "./schemas/balance.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class BalancesRepository extends BaseRepository<BalanceDocument> {
  constructor(@InjectModel(Balance.name) private balancesModel: BaseModel<BalanceDocument>) {
    super(balancesModel);
  }

  async findByUserId(userId: any): Promise<Balance> {
    const result = await this.findOne({ user: userId });
    if (!result) {
      throw new NotFoundException("Not Found Balance");
    }
    return result;
  }
}
