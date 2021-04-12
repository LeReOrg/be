"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _product = _interopRequireDefault(require("./product"));

var _category = _interopRequireDefault(require("./category"));

var _user = _interopRequireDefault(require("./user"));

var _cart = _interopRequireDefault(require("./cart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  product: _product["default"],
  category: _category["default"],
  user: _user["default"],
  cart: _cart["default"]
};
exports["default"] = _default;