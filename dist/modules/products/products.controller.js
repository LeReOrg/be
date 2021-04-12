"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProductsController = void 0;

var _logger2 = require("../logger/logger.module");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _logger = new WeakMap();

var ProductsController = /*#__PURE__*/function () {
  function ProductsController() {
    _classCallCheck(this, ProductsController);

    _logger.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _logger, new _logger2.LoggerModule("ProductsController"));

    _classPrivateFieldGet(this, _logger).info("Hello");
  }

  _createClass(ProductsController, [{
    key: "get",
    value: function get(req, res) {
      res.send("Get");
    }
  }, {
    key: "add",
    value: function add(req, res) {
      console.log(_classPrivateFieldGet(this, _logger)); // this.#logger.info(req.body);

      res.send("Done");
    }
  }]);

  return ProductsController;
}();

exports.ProductsController = ProductsController;
;