"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigModule = void 0;

var _dotenv = require("dotenv");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }

function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

(0, _dotenv.config)();

var ConfigModule = /*#__PURE__*/function () {
  function ConfigModule() {
    _classCallCheck(this, ConfigModule);
  }

  _createClass(ConfigModule, null, [{
    key: "retrieveConfig",
    value: function retrieveConfig(key) {
      if (!key) return _classStaticPrivateFieldSpecGet(this, ConfigModule, _config);else return _classStaticPrivateFieldSpecGet(this, ConfigModule, _config)[key];
    }
  }]);

  return ConfigModule;
}();

exports.ConfigModule = ConfigModule;
var _config = {
  writable: true,
  value: {
    mongoDbUri: process.env.MONGODB_URI,
    port: process.env.PORT
  }
};
;