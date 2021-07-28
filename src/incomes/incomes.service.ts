import { Injectable } from "@nestjs/common";
import { IncomesRepository } from "./incomes.repository";
import { FeeRates } from "../income-fees/enums/fee-rates";
import { FeeTypes } from "../income-fees/enums/fee-types";
import { Order } from "../orders/schemas/order.schema";
import { Income } from "./schemas/income.schema";
import { FilterQuery } from "mongoose";
import { User } from "../users/schemas/user.schema";

@Injectable()
export class IncomesService {
  constructor(private incomesRepository: IncomesRepository) {}

  async createIncomeFromOrderForLessor(order: Order): Promise<Income> {
    const lesseePaid = order.amount;

    let lessorEarned = order.amount;

    const commissionFeeAmount = (lessorEarned * FeeRates.CommissionFee) / 100;
    lessorEarned -= commissionFeeAmount;

    const personalIncomeTaxAmount = (lessorEarned * FeeRates.PersonalIncomeTax) / 100;
    lessorEarned -= personalIncomeTaxAmount;

    return this.incomesRepository.createOne({
      user: order.lessor,
      order,
      lesseePaid,
      lessorEarned,
      fees: [
        {
          type: FeeTypes.CommissionFee,
          rate: FeeRates.CommissionFee,
          amount: commissionFeeAmount,
        },
        {
          type: FeeTypes.PersonalIncomeTax,
          rate: FeeRates.PersonalIncomeTax,
          amount: personalIncomeTaxAmount,
        },
      ],
    });
  }

  async filterIncomes(
    filters: {
      startDate?: Date;
      endDate?: Date;
      user: User;
    },
    options: {
      limit: number;
      page: number;
      sort?: any;
    },
  ) {
    const { startDate, endDate, user } = filters;
    const conditions: FilterQuery<Income> = { user };
    if (startDate || endDate) {
      const startDateCondition = startDate && { $gte: startDate };
      const endDateCondition = endDate && { $lte: endDate };
      conditions.createdAt = { ...startDateCondition, ...endDateCondition };
    }
    options.sort = { ...options.sort, createdAt: "desc" };
    return this.incomesRepository.paginate(conditions, options);
  }

  async findIncomeDetailById(id: any): Promise<Income> {
    return this.incomesRepository.findByIdOrThrowException(id, null, {
      populate: { path: "order", populate: { path: "detail" } },
    });
  }
}
