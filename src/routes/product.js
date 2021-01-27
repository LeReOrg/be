import { Router } from 'express';
import models from '../models';
import Product from '../models/product';

const router = Router();

// getTopProducts
router.get('/getTopProduct/:page', (req, res) => {
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

  Product.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .populate('category')
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
