import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { OrderStatus } from "../enums/order-status";
import { Address } from "../../addresses/schemas/address.schema";
import { OrderDetail } from "../../order-details/schemas/order-detail.schema";

@Schema({ timestamps: true })
export class Order {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "OrderDetail" })
  detail: OrderDetail;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  lessor: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  lessee: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Address" })
  lessorAddress: Address;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Address" })
  lesseeAddress: Address;

  @Prop({ required: true })
  hiredDays: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  deposit: number;

  @Prop({ required: true, enum: OrderStatus })
  status: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
