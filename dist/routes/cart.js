"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _models = _interopRequireDefault(require("../models"));

var _cart = _interopRequireDefault(require("../models/cart"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
router.get('/', function (req, res) {
  _cart["default"].find().then(function (cart) {
    return res.status(200).json(cart);
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // getProductsByCartID()

router.get('/getProductByCartId/:cartId', function (req, res) {
  _cart["default"].find({
    id: req.params["cartId"]
  }).select({
    product_details: 1
  }).then(function (cart) {
    return res.status(200).json(cart);
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // getCartByOwnerId/:OwnerId

router.get('/getCartByOwnerId/:OwnerId', function (req, res) {
  _cart["default"].find({
    owner_id: req.params["OwnerId"]
  }).then(function (cart) {
    return res.status(200).json(cart);
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
});
var _default = router;
exports["default"] = _default;