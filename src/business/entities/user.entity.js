import { Schema, model } from "mongoose";
import CONSTANTS from "./constants";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
  uid: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: {
        uid: { $type: "string" }
      },
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  salt: {
    type: String,
  },
  hash: {
    type: String,
  },
  avatar: {
    type: String,
  },
  resetPasswordOtpCode: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthDay: {
    type: Date,
  },
  isHirer: {
    type: Boolean,
  },
}, {
  timestamps: true,
});

schema.plugin(mongoosePaginate);

const User = model(CONSTANTS.collection.user.name, schema);

export default User;