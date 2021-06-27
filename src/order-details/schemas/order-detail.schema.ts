import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Product } from "../../products/schemas/product.schema";
import { Discount } from "../../products/schemas/discount.schema";
import { CloudinaryImage } from "../../cloudinary/schemas/cloudinary-image.schema";
import { Order } from "../../orders/schemas/order.schema";

@Schema({ timestamps: true })
export class OrderDetail {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: "Order" })
  order: Order;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: "Product" })
  product: Product;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  unitDeposit: number;

  @Prop({ required: false })
  discount?: Discount;

  @Prop()
  thumbnail: CloudinaryImage;
}

export type OrderDetailDocument = OrderDetail & Document;
export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
