import { Schema, model } from "mongoose";
import CONSTANTS from "./constants";

const User = model(CONSTANTS.collection.user.name, new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
}));

export default User;