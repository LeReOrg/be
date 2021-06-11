import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class User {
  _id: MongooseSchema.Types.ObjectId;

  id: string;

  @Prop({ index: { unique: true } })
  uid: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  displayName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  salt: string;

  @Prop()
  hash: string;

  @Prop()
  avatar: string;

  @Prop()
  gender: string;

  @Prop()
  birthDay: Date;

  @Prop()
  isHirer: boolean;

  @Prop(
    raw({
      resetPassword: { type: String },
    }),
  )
  otp: Record<string, any>;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
