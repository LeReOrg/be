import { Schema } from "mongoose";

const schema = new Schema({
  publicId: {
    type: String,
  },
  url: {
    type: String,
  },
}, {
  _id : false,
  timestamps: false,
});

export default schema;