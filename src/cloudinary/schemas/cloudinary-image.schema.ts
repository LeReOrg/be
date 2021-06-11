import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ _id: false, timestamps: false })
export class CloudinaryImage {
  @Prop()
  publicId: string;

  @Prop()
  url: string;
}

export type CloudinaryImageDocument = CloudinaryImage & Document;
export const CloudinaryImageSchema = SchemaFactory.createForClass(CloudinaryImage);
