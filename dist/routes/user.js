"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _models = _interopRequireDefault(require("../models"));

var _user = _interopRequireDefault(require("../models/user"));

var _cart = _interopRequireDefault(require("../models/cart"));

var _sendEmail = _interopRequireDefault(require("../send-email"));

var _product = _interopRequireDefault(require("../models/product"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)();
var TOKEN = "a7sh2jd92hzf";
router.get('/', function (req, res) {
  _user["default"].find().then(function (category) {
    return res.json(category);
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
});
router.post('/resetPassword', function (req, res) {
  res.status(200).json({
    token: TOKEN
  });
}); // validateToken()

router.post('/validateToken', function (req, res) {
  if (req.body.token === TOKEN) {
    res.status(200).json({
      'Message': 'Ok'
    });
  } else {
    res.status(400).json({
      'Error': 'Token not match'
    });
  }
}); // signup

router.post('/signup', function (req, res) {
  _user["default"].findOne({
    email: req.body.email
  }).then(function (user) {
    if (user != null) {
      res.status(403).json({
        'Error': 'User already exists'
      });
    } else {
      _user["default"].create({
        authentication: {
          password: req.body.password
        },
        full_name: req.body.full_name,
        mobile: req.body.mobile,
        email: req.body.email
      }).then(function (user) {
        res.status(200).json({
          status: 'Registration Successful!',
          user: user
        });
      });
    }
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // changePassword()

router.post('/changePassword', function (req, res) {
  var email = req.body.email;
  var new_password = req.body.new_password;

  _user["default"].findOne({
    email: email
  }).then(function (user) {
    if (user != null) {
      user.password = new_password;
      user.save().then(function () {
        return res.status(200).json({
          'Message': 'Ok'
        });
      })["catch"](function (err) {
        return res.status(400).json('Error: ' + err);
      });
    } else {
      res.status(200).json({
        'Message': 'User not found'
      });
    }
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // login()

router.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  _user["default"].findOne({
    email: email
  }).then(function (user) {
    if (user != null) {
      res.status(200).json({
        'Message': 'Ok'
      });
    } else {
      res.status(200).json({
        'Message': 'User not found'
      });
    }
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // loginFirebase()

router.post('/loginFirebase', function (req, res) {
  var inputToken = req.body.token;

  _user["default"].find({
    firebase_token: inputToken
  }).then(function (user) {
    if (user.length) {
      res.status(200).json({
        'Message': 'Ok'
      });
    } else {
      res.status(400).json({
        'Error': 'Invalid user'
      });
    }
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getCartByUserID()

router.get('/getCartByUserId/:userId', function (req, res) {
  _cart["default"].find({
    owner_id: req.params["userId"]
  }).then(function (category) {
    return res.json(category);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
});
var _default = router;
exports["default"] = _default;