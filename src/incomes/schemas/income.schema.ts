import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { IncomeFee } from "../../income-fees/schemas/income-fee.schema";
import { Order } from "../../orders/schemas/order.schema";
import { User } from "../../users/schemas/user.schema";

@Schema({ timestamps: true })
export class Income {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Order" })
  order: Order;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: true })
  lesseePaid: number;

  @Prop({ required: true })
  lessorEarned: number;

  @Prop()
  fees: IncomeFee[];

  createdAt: Date;
}

export type IncomeDocument = Income & Document;
export const IncomeSchema = SchemaFactory.createForClass(Income);
