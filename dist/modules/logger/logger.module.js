"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerModule = void 0;

var _winston = _interopRequireDefault(require("winston"));

var _util = _interopRequireDefault(require("util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _winston$format = _winston["default"].format,
    combine = _winston$format.combine,
    colorize = _winston$format.colorize,
    timestamp = _winston$format.timestamp,
    label = _winston$format.label,
    printf = _winston$format.printf;

var _formatMessage = new WeakSet();

var LoggerModule = /*#__PURE__*/function () {
  function LoggerModule(context) {
    _classCallCheck(this, LoggerModule);

    _formatMessage.add(this);

    _defineProperty(this, "context", "Default");

    this.context = context;
    this.createLogger();
  }

  _createClass(LoggerModule, [{
    key: "createLogger",
    value: function createLogger() {
      this.winston = _winston["default"].createLogger({
        format: combine(colorize(), timestamp({
          format: function format() {
            return new Date().toLocaleString();
          }
        }), label({
          label: this.context
        }), printf(_classPrivateMethodGet(this, _formatMessage, _formatMessage2))),
        transports: [new _winston["default"].transports.Console()]
      });
    }
  }, {
    key: "info",
    value: function info() {
      this.winston.log({
        level: 'info',
        message: _util["default"].format.apply(_util["default"], arguments)
      });
    }
  }, {
    key: "error",
    value: function error() {
      this.winston.log({
        level: 'error',
        message: _util["default"].format.apply(_util["default"], arguments)
      });
    }
  }]);

  return LoggerModule;
}();

exports.LoggerModule = LoggerModule;

function _formatMessage2(info) {
  var level = info.level,
      timestamp = info.timestamp,
      label = info.label,
      message = info.message;
  return "[".concat(level, "][").concat(timestamp, "][").concat(label, "] - ").concat(message);
}

;