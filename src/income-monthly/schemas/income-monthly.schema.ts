import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

@Schema({ timestamps: true })
export class IncomeMonthly {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  amount: number;
}

export type IncomeMonthlyDocument = IncomeMonthly & Document;
export const IncomeMonthlySchema = SchemaFactory.createForClass(IncomeMonthly);
