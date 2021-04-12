"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var cartSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  owner_id: {
    type: String,
    required: true
  },
  product_details: {
    product_ids: [Number],
    quantities: [Number]
  },
  status: {
    type: String,
    required: true
  },
  from_date: {
    type: Date,
    required: true
  },
  to_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

var Cart = _mongoose["default"].model('Cart', cartSchema);

module.exports = Cart;