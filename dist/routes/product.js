"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _product = _interopRequireDefault(require("../models/product"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = (0, _express.Router)(); // getTopProducts

router.get('/getTopProduct/:page', function (req, res) {
  var pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.body["limit"], 10) || 10
  };
  var page = 0;

  _product["default"].countDocuments({}, function (err, count) {
    if (!err) {
      page = ~~(count / pageOptions.limit) + 1;
    }
  });

  _product["default"].find().skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).exec(function (err, product) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    var result = {};
    var keyPage = 'numPage';
    var keyProduct = 'products';
    result[keyPage] = page;
    result[keyProduct] = product;
    res.status(200).json(result);
  });
}); // getProductPage

router.get('/getProductPage', function (req, res) {
  _product["default"].countDocuments({}, function (err, count) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json(count);
  });
}); // getAllProduct

router.get('/getAllProduct', function (req, res) {
  _product["default"].find().populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).exec(function (err, products) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.status(200).json(products);
  });
}); // filter products by price: increase

router.get('/filterByPrice/inc', function (req, res) {
  _product["default"].find().sort({
    price: 1
  }).then(function (product) {
    return res.status(200).json(product);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // filter products by price: decrease

router.get('/filterByPrice/dec', function (req, res) {
  _product["default"].find().sort({
    price: -1
  }).then(function (product) {
    return res.status(200).json(product);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getProductByCategoryId()

router.get('/getProductByCategoryId/:categoryId/:page', function (req, res) {
  var pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.body["limit"], 10) || 10
  };
  var cateString = JSON.stringify(req.params["categoryId"]);

  _product["default"].find({}).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).then(function (product) {
    var prod = [];
    var count = 0;
    product.forEach(function (p) {
      var cateIdString = JSON.stringify(p.category._id);

      if (cateIdString === cateString) {
        prod = prod.concat(p);
        count++;
      }
    });
    var numPage = ~~(count / pageOptions.limit) + 1;
    var result = {};
    var keyPage = 'numPage';
    var keyProduct = 'products';
    result[keyPage] = numPage;
    var start = pageOptions.page * pageOptions.limit;
    var stop = start + pageOptions.limit > count ? count : start + pageOptions.limit;
    result[keyProduct] = prod.slice(start, stop);
    res.status(200).json(result);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getProductByCategoryId(): increase

router.get('/getProductByCategoryId/inc/:categoryId/:page', function (req, res) {
  var pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.body["limit"], 10) || 10
  };
  var cateString = JSON.stringify(req.params["categoryId"]);

  _product["default"].find({}).sort({
    price: 1
  }).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).then(function (product) {
    var prod = [];
    var count = 0;
    product.forEach(function (p) {
      var cateIdString = JSON.stringify(p.category._id);

      if (cateIdString === cateString) {
        prod = prod.concat(p);
        count++;
      }
    });
    var numPage = ~~(count / pageOptions.limit) + 1;
    var result = {};
    var keyPage = 'numPage';
    var keyProduct = 'products';
    result[keyPage] = numPage;
    var start = pageOptions.page * pageOptions.limit;
    var stop = start + pageOptions.limit > count ? count : start + pageOptions.limit;
    result[keyProduct] = prod.slice(start, stop);
    res.status(200).json(result);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getProductByCategoryId(): decrease

router.get('/getProductByCategoryId/dec/:categoryId/:page', function (req, res) {
  var pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.body["limit"], 10) || 10
  };
  var cateString = JSON.stringify(req.params["categoryId"]);

  _product["default"].find({}).sort({
    price: -1
  }).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).then(function (product) {
    var prod = [];
    var count = 0;
    product.forEach(function (p) {
      var cateIdString = JSON.stringify(p.category._id);

      if (cateIdString === cateString) {
        prod = prod.concat(p);
        count++;
      }
    });
    var numPage = ~~(count / pageOptions.limit) + 1;
    var result = {};
    var keyPage = 'numPage';
    var keyProduct = 'products';
    result[keyPage] = numPage;
    var start = pageOptions.page * pageOptions.limit;
    var stop = start + pageOptions.limit > count ? count : start + pageOptions.limit;
    result[keyProduct] = prod.slice(start, stop);
    res.status(200).json(result);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getProductById

router.get('/getProductById/:Id', function (req, res) {
  _product["default"].find({
    id: req.params["Id"]
  }).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).then(function (product) {
    return res.status(200).json(product);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); // getFirstImage

router.get('/getFirstImage/:Id', function (req, res) {
  _product["default"].find({
    id: req.params["Id"]
  }).select({
    image_url: 1,
    _id: 0
  }).then(function (product) {
    return res.status(200).json(product);
  })["catch"](function (err) {
    return res.status(500).json('Error: ' + err);
  });
}); //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)

function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km

  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
} // Converts numeric degrees to radians


function toRad(Value) {
  return Value * Math.PI / 180;
} // filterByLocation


router.get('/filterByLocation', function (req, res) {
  var pageOptions = {
    page: parseInt(req.query["page"], 10) || 0,
    limit: parseInt(req.query["limit"], 10) || 10
  };
  var page = 0;

  _product["default"].countDocuments({}, function (err, count) {
    if (!err) {
      page = ~~(count / pageOptions.limit) + 1;
    }
  });

  var lat = req.query.lat;
  var _long = req.query["long"];

  _product["default"].find().sort({
    location: 1
  }).skip(pageOptions.page * pageOptions.limit).limit(pageOptions.limit).populate('category').populate({
    path: 'owner_id',
    select: 'first_name last_name email'
  }).exec(function (err, product) {
    if (err) {
      res.status(500).json(err);
      console.log("hhaa");
      return;
    }

    var result = {};
    var keyPage = 'numPage';
    var keyProduct = 'products';
    result[keyPage] = page;
    result[keyProduct] = product;
    res.status(200).json(result);
  });
}); // addProduct

router.post('/addProduct', function (req, res) {
  // const id = req.body.id;
  // const category = req.body.category;
  // const owner_id = req.body.owner_id;
  var name = req.body.name; // const image = req.body.image;
  // const cover_images = req.body.cover_images;

  var price = req.body.price;
  var in_stock = req.body.in_stock;
  var description = req.body.description; // const location = req.body.location;

  var newProduct = new _product["default"]({
    // id,
    // category,
    // owner_id,
    name: name,
    // image,
    // cover_images,
    price: price,
    in_stock: in_stock,
    description: description // location

  });
  newProduct.save().then(function () {
    return res.json('Product added!');
  })["catch"](function (err) {
    return res.status(400).json('Error: ' + err);
  });
}); // db.products.update({id: '17'}, {$set: {location: {longtitude: 100.113, latitude: 89.232}}}, {multi: true}) script for add new field

var _default = router;
exports["default"] = _default;