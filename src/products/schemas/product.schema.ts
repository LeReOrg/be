import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";
import { Discount } from "./discount.schema";
import { Location } from "./location.schema";
import { User } from "../../users/schemas/user.schema";
import { Category } from "../../categories/schemas/category.schema";

@Schema({ timestamps: true })
export class Product {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  description: string;

  @Prop()
  depositPrice: number;

  @Prop()
  shortestHiredDays: number;

  @Prop({ default: false })
  isTopProduct: boolean;

  @Prop()
  breadcrumb: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Category" })
  category: Category;

  @Prop()
  location: Location;

  @Prop()
  discounts: Discount[];

  @Prop()
  images: CloudinaryImage[];
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
