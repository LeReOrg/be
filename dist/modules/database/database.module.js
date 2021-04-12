"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatabaseModule = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _logger2 = require("../logger/logger.module");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _uri = new WeakMap();

var _options = new WeakMap();

var _logger = new WeakMap();

var DatabaseModule = /*#__PURE__*/function () {
  function DatabaseModule(uri, options) {
    _classCallCheck(this, DatabaseModule);

    _uri.set(this, {
      writable: true,
      value: void 0
    });

    _options.set(this, {
      writable: true,
      value: void 0
    });

    _logger.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _uri, uri);

    _classPrivateFieldSet(this, _options, options);

    _classPrivateFieldSet(this, _logger, new _logger2.LoggerModule("DatabaseModule"));
  }

  _createClass(DatabaseModule, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      _mongoose["default"].connect(_classPrivateFieldGet(this, _uri), _classPrivateFieldGet(this, _options));

      _mongoose["default"].connection.on("error", function (error) {
        return _classPrivateFieldGet(_this, _logger).error(error);
      });

      _mongoose["default"].connection.on('open', function () {
        return _classPrivateFieldGet(_this, _logger).info('Etablished connection to Mongo Atlas');
      });
    }
  }]);

  return DatabaseModule;
}();

exports.DatabaseModule = DatabaseModule;