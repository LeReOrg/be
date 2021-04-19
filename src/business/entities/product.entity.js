import { Schema, model } from "mongoose";
import CONSTANTS from "./constants";
import mongoosePaginate from "mongoose-paginate-v2";
import CloudinaryImage from "./cloudinary.schema";

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quanlity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  depositPrice: {
    type: Number,
  },
  shortestHiredDays: {
    type: Number,
  },
  discounts: [{
    days: {
      type: Number,
    },
    discount: {
      type: Number,
    },
  }],
  isTopProduct: {
    type: Boolean,
    default: false
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: CONSTANTS.collection.category.name,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: CONSTANTS.collection.user.name,
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: CONSTANTS.collection.brand.name,
  },
  images: [CloudinaryImage],
  location: {
    latitude: {
      type: Number,
    },
    longtitude: {
      type: Number,
    },
    address: {
      type: String,
    },
    ward: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

schema.plugin(mongoosePaginate);

const Product = model(CONSTANTS.collection.product.name, schema);

export default Product;