"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var categorySchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

var Category = _mongoose["default"].model('Category', categorySchema);

module.exports = Category;