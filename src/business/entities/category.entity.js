import { Schema, model } from "mongoose";
import CONSTANTS from "./constants";
import CloudinaryImage from "./cloudinary.schema";

const Category = model(CONSTANTS.collection.category.name, new Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: CloudinaryImage
}, {
  timestamps: true,
}));

export default Category;