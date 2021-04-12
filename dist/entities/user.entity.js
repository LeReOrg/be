"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _constants = _interopRequireDefault(require("./constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var User = (0, _mongoose.model)(_constants["default"].collection.user.name, new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
}));
var _default = User;
exports["default"] = _default;