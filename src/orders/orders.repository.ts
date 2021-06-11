import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { Order, OrderDocument } from "./schemas/order.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class OrdersRepository extends BaseRepository<OrderDocument> {
  constructor(@InjectModel(Order.name) private __orderModel: BaseModel<OrderDocument>) {
    super(__orderModel);
  }
}
