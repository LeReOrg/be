import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";
import { Discount } from "./discount.schema";
import { Location } from "./location.schema";
import { User } from "../../users/schemas/user.schema";
import { Category } from "../../categories/schemas/category.schema";
import { Breadcrumb } from "./breadcrumb.schema";

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

  @Prop({ required: false })
  term: string;

  @Prop({ required: false })
  requiredLicenses: string;

  @Prop({ required: false })
  breadcrumbs: Breadcrumb[];

  @Prop()
  location: Location;

  @Prop()
  discounts: Discount[];

  @Prop()
  images: CloudinaryImage[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Category" })
  category: Category;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  user: User;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
