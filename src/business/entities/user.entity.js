import { Schema, model } from "mongoose";
import CONSTANTS from "./constants";

const User = model(CONSTANTS.collection.user.name, new Schema({
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
}, {
  timestamps: true,
}));

export default User;