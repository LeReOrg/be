import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { Product } from "../../products/schemas/product.schema";
import { Order } from "../../orders/schemas/order.schema";

@Schema({ timestamps: true })
export class Address {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: false })
  fullName: string;

  @Prop({ required: false })
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

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: "User" })
  user?: User;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: "Product" })
  product?: Product;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: "Order" })
  order?: Order;
}

export type AddressDocument = Address & Document;
export const AddressSchema = SchemaFactory.createForClass(Address);
