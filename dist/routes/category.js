"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _models = _interopRequireDefault(require("../models"));

var _category = _interopRequireDefault(require("../models/category"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // getCategory

router.get('/getCategory', function (req, res) {
  _category["default"].find().then(function (category) {
    return res.json(category);
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
});
router.post('/', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var image_url = req.body.image_url;
  var newCategory = new _category["default"]({
    id: id,
    name: name,
    image_url: image_url
  });
  newCategory.save().then(function () {
    return res.json('Category added!');
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
});
var _default = router;
exports["default"] = _default;