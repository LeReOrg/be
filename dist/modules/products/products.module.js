"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _products = require("./products.controller");

var router = (0, _express.Router)();
var productsController = new _products.ProductsController();
router.get("/", productsController.get);
router.post("/", productsController.add);
var _default = router;
exports["default"] = _default;