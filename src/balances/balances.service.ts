import { Injectable } from "@nestjs/common";
import { User } from "../users/schemas/user.schema";
import { BalancesRepository } from "./balances.repository";
import { Balance } from "./schemas/balance.schema";

@Injectable()
export class BalancesService {
  constructor(private balancesRepository: BalancesRepository) {}

  async openUserBalance(user: User): Promise<void> {
    await this.balancesRepository.createOne({ currentBalance: 0, user });
  }

  async increaseUserBalance(amount: number, user: User): Promise<void> {
    await this.balancesRepository.updateOne({ user }, { $inc: { currentBalance: amount } });
  }

  async findBalanceByUserId(userId: string): Promise<Balance> {
    return this.balancesRepository.findByUserId(userId);
  }
}
