import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";

@Schema({ timestamps: true })
export class Address {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: false })
  latitude?: number;

  @Prop({ required: false })
  longitude?: number;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  ward: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: false })
  isDefaultAddress?: boolean;

  @Prop({ required: false })
  isPickupAddress?: boolean;

  @Prop({ required: false })
  isShippingAddress?: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
