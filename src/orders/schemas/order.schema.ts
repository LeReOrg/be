import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Product } from "../../products/schemas/product.schema";
import { User } from "../../users/schemas/user.schema";
import { OrderStatus } from "../enums/order-status";
import { Address } from "../../addresses/schemas/address.schema";

@Schema({ timestamps: true })
export class Order {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Product" })
  product: Product;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  lessor: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  lessee: User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Address" })
  lessorAddress: Address;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Address" })
  lesseeAddress: Address;

  @Prop()
  thumbnailUrl: string;

  @Prop({ required: true })
  hiredDays: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  deposit: number;

  @Prop({ required: true, enum: OrderStatus })
  status: string;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
