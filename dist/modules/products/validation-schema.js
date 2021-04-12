"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createproductSchema = _joi["default"].object({
  name: _joi["default"].string().required().trim(),
  price: _joi["default"].number().required().min(0),
  quanlity: _joi["default"].number().required().min(0),
  description: _joi["default"].string().required().trim(),
  depositPrice: _joi["default"].number().required().min(0),
  shortestHiredDays: _joi["default"].number().required().min(0),
  discounts: _joi["default"].number().required().min(0),
  categoryId: _joi["default"].string().required().trim(),
  shopId: _joi["default"].string().required().trim(),
  brandId: _joi["default"].string().required().trim(),
  thumbnailImage: _joi["default"].string().required().trim().base64(),
  images: _joi["default"].array().items(_joi["default"].string().trim().base64()),
  location: _joi["default"].object({
    latitude: _joi["default"].number().required(),
    longtitude: _joi["default"].number().required(),
    address: _joi["default"].string().required(),
    ward: _joi["default"].string().required(),
    district: _joi["default"].string().required(),
    city: _joi["default"].string().required()
  })
});