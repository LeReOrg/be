import { Injectable } from "@nestjs/common";
import { IncomeMonthlyRepository } from "./income-monthly.repository";
import { IncomeMonthly } from "./schemas/income-monthly.schema";
import { User } from "../users/schemas/user.schema";
import { FilterQuery } from "mongoose";
import * as moment from "moment";

@Injectable()
export class IncomeMonthlyService {
  constructor(private incomeMonthlyRepository: IncomeMonthlyRepository) {}

  async increaseUserIncomeMonthly(user: User, timestamp: Date, value: number) {
    const firstDateOfMonth = new Date(moment(timestamp).set("date", 1).format("YYYY-MM-DD"));

    return this.incomeMonthlyRepository.upsertOne(
      { user, timestamp: firstDateOfMonth },
      { user, timestamp: firstDateOfMonth, $inc: { amount: value } },
    );
  }

  async filterIncomeMonthly(
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
    const conditions: FilterQuery<IncomeMonthly> = { user };
    if (startDate || endDate) {
      const startDateCondition = startDate && { $gte: startDate };
      const endDateCondition = endDate && { $lte: endDate };
      conditions.timestamp = { ...startDateCondition, ...endDateCondition };
    }
    options.sort = { ...options.sort, timestamp: "desc" };
    return this.incomeMonthlyRepository.paginate(conditions, options);
  }
}
