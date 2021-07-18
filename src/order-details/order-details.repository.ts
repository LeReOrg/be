import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../common/repositories/base.repository";
import { OrderDetail, OrderDetailDocument } from "./schemas/order-detail.schema";
import { BaseModel } from "../common/interfaces/base-model";

@Injectable()
export class OrderDetailsRepository extends BaseRepository<OrderDetailDocument> {
  constructor(
    @InjectModel(OrderDetail.name) private orderDetailModel: BaseModel<OrderDetailDocument>,
  ) {
    super(orderDetailModel);
  }
}
