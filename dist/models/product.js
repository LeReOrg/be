"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var imageSchema = new Schema({
  original: String,
  thumbnail: String
}, {
  timestamps: true
});
var productSchema = new Schema({
  id: {
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  image: imageSchema,
  cover_images: [imageSchema],
  price: {
    type: Number,
    required: true
  },
  in_stock: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  location: {
    longtitude: Number,
    latitude: Number
  }
}, {
  timestamps: true
});

var Product = _mongoose["default"].model('Product', productSchema);

module.exports = Product;