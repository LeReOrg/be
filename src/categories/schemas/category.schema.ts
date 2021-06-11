import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";

@Schema({ timestamps: true })
export class Category {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  thumbnail: CloudinaryImage;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
