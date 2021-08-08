import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";
import { CategoryStatus } from "../enum/category-status";

@Schema({ timestamps: true })
export class Category {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  thumbnail: CloudinaryImage;

  @Prop({ enum: CategoryStatus })
  status: string;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
