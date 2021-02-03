import { Router } from 'express';
import Product from '../models/product';

const router = Router();

// getTopProducts
router.get('/getTopProduct/:page', (req, res) => {
  const pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.body["limit"], 10) || 10
  };

  let page = 0;
  Product.countDocuments({}, function(err, count){
    if (!err) {
      page = ~~(count / pageOptions.limit) + 1;
    }
  });

  Product.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .populate('category')
    .populate({ path: 'owner_id', select: 'first_name last_name email'})
    .exec(function (err, product) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      let result = {};
      let keyPage = 'numPage';
      let keyProduct = 'products';
      result[keyPage] = page;
      result[keyProduct] = product;

      res.status(200).json(result);
    })
});

// getProductPage
router.get('/getProductPage', (req, res) => {
  Product.countDocuments({}, function(err, count){
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.status(200).json(count);
  });
});

// filter products by price: increase
router.get('/filterByPrice/inc', (req, res) => {
  Product.find()
    .sort({price: 1})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))
});

// filter products by price: decrease
router.get('/filterByPrice/dec', (req, res) => {
  Product.find()
    .sort({price: -1})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))
});
  
// getProductByCategoryId()
router.get('/getProductByCategoryId/:categoryId', (req, res) => {
  Product.find({category_id: req.params["categoryId"]})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))  
});

// getProductById
router.get('/getProductById/:Id', (req, res) => { 
  Product.find({id: req.params["Id"]})
    .populate('category')
    .populate({ path: 'owner_id', select: 'first_name last_name email'})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))
})

// getFirstImage
router.get('/getFirstImage/:Id', (req, res) => {
  Product.find({id: req.params["Id"]})
    .select({ image_url : 1 , _id: 0})
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))
})

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
  return Value * Math.PI / 180;
}

// filterByLocation
router.get('/filterByLocation', (req,res) => {
  const pageOptions = {
    page: parseInt(req.query["page"], 10) || 0,
    limit: parseInt(req.query["limit"], 10) || 10
  };

  let page = 0;
  Product.countDocuments({}, function(err, count){
    if (!err) {
      page = ~~(count / pageOptions.limit) + 1;
    }
  });

  const lat = req.query.lat;
  const long = req.query.long;

  Product.find()
    .sort({location: 1})
    .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .populate('category')
      .populate({ path: 'owner_id', select: 'first_name last_name email'})
      .exec(function (err, product) {
        if (err) {
          res.status(500).json(err);
          console.log("hhaa")

          return;
        }
        let result = {};
        let keyPage = 'numPage';
        let keyProduct = 'products';
        result[keyPage] = page;
        result[keyProduct] = product;

        res.status(200).json(result);
      });
});

// addProduct
router.post('/addProduct', (req,res) => {
  const id = req.body.id;
  const category = req.body.category;
  const owner_id = req.body.owner_id;
  const name = req.body.name;
  const image = req.body.image;
  const cover_images = req.body.cover_images; 
  const price = req.body.price;
  const in_stock = req.body.in_stock;
  const description = req.body.description;
  const location = req.body.location;

  const newProduct = new Product({
    id,
    category,
    owner_id, 
    name,
    image,
    cover_images,
    price,
    in_stock,
    description,
    location
  });
  newProduct.save()
    .then(() => res.json('Product added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// db.products.update({id: '17'}, {$set: {location: {longtitude: 100.113, latitude: 89.232}}}, {multi: true}) script for add new field

export default router;
