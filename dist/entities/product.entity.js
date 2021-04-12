"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var _constants = _interopRequireDefault(require("./constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Product = (0, _mongoose.model)(_constants["default"].collection.product.name, new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quanlity: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  depositPrice: {
    type: Number
  },
  shortestHiredDays: {
    type: Number
  },
  discounts: [{
    days: {
      type: Number
    },
    discount: {
      type: Number
    }
  }],
  categoryId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: _constants["default"].collection.category.name
  },
  ownerId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: _constants["default"].collection.user.name
  },
  brandId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: _constants["default"].collection.brand.name
  },
  thumbnailImage: {
    type: String
  },
  images: [{
    original: {
      type: String
    },
    resized: {
      type: String
    }
  }],
  location: {
    latitude: {
      type: Number
    },
    longtitude: {
      type: Number
    },
    address: {
      type: String
    },
    ward: {
      type: String
    },
    district: {
      type: String
    },
    city: {
      type: String
    }
  }
}, {
  timestamps: true
}));
var _default = Product;
exports["default"] = _default;