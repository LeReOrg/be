import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false, timestamps: false })
export class Discount {
  @Prop()
  days: number;

  @Prop()
  discount: number;
}

export type DiscountDocument = Discount & Document;
export const DiscountSchema = SchemaFactory.createForClass(Discount);
