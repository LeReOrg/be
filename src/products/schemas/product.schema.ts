import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";
import { Discount } from "./discount.schema";
import { User } from "../../users/schemas/user.schema";
import { Category } from "../../categories/schemas/category.schema";
import { Breadcrumb } from "./breadcrumb.schema";
import { Address } from "../../addresses/schemas/address.schema";
import { ProductStatus } from "../enums/product-status";

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

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  depositPrice: number;

  @Prop({ required: true })
  shortestHiredDays: number;

  @Prop({ default: false })
  isTopProduct: boolean;

  @Prop({ required: false })
  label?: string;

  @Prop({ required: false })
  term?: string;

  @Prop({ required: false })
  requiredLicenses?: string[];

  @Prop({ required: false })
  breadcrumbs?: Breadcrumb[];

  @Prop({ required: false })
  discounts?: Discount[];

  @Prop({ required: true })
  images: CloudinaryImage[];

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Category" })
  category: Category;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: "Address" })
  address?: Address;

  @Prop({ enum: ProductStatus })
  status: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
