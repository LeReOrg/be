import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

@Schema({ timestamps: true })
export class Balance {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: true, default: 0 })
  currentBalance: number;
}

export type BalanceDocument = Balance & Document;
export const BalanceSchema = SchemaFactory.createForClass(Balance);
