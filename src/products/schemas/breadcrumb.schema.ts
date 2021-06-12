import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ _id: false, timestamps: false })
export class Breadcrumb {
  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop({ required: false })
  categoryId?: MongooseSchema.Types.ObjectId;
}

export type BreadcrumbDocument = Breadcrumb & Document;
export const BreadcrumbSchema = SchemaFactory.createForClass(Breadcrumb);
