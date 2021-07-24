import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: false, _id: false })
export class IncomeFee {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ required: true })
  amount: number;
}

export type IncomeFeeDocument = IncomeFee & Document;
export const IncomeFeeSchema = SchemaFactory.createForClass(IncomeFee);
