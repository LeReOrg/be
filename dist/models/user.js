"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var userAuthenSchema = new Schema({
  // username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
var userSchema = new Schema({
  id: {
    type: String
  },
  order_id: {
    type: String
  },
  first_name: {
    type: String,
    required: true,
    "default": "A"
  },
  last_name: {
    type: String,
    required: true,
    "default": "Nguyen"
  },
  full_name: {
    type: String,
    required: true,
    "default": "Nguyen A"
  },
  gender: {
    type: String,
    required: true,
    "default": "male"
  },
  mobile: {
    type: String,
    required: true,
    "default": "113"
  },
  email: {
    type: String
  },
  address_longitude: {
    type: Number,
    required: true,
    "default": 1.0000
  },
  address_latitude: {
    type: Number,
    required: true,
    "default": 1.0000
  },
  firebase_token: {
    type: String
  },
  authentication: userAuthenSchema
}, {
  timestamps: true
});

var User = _mongoose["default"].model('User', userSchema);

module.exports = User;