import { Router } from 'express';
import models from '../models';
import Product from '../models/product';

const router = Router();

// getTopProducts
router.get('/getTopProduct', (req, res) => {
  Product.find()
    .then(product => res.status(200).json(product))
    .catch(err => res.status(500).json('Error: ' + err))
});

// getProductByPage
router.get('/getProductByPage/:page', (req, res) => {
  const pageOptions = {
    page: parseInt(req.params["page"], 10) || 0,
    limit: parseInt(req.params["limit"], 10) || 10
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
    });
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

// addProduct
router.post('/addProduct', (req,res) => {
  const id = req.body.id;
  const category_id = req.body.category_id
  const owner_id = req.body.owner_id
  const name = req.body.name;
  const image_url = req.body.image_url;
  const thumbnails = req.body.thumbnails;
  const price = req.body.price;
  const in_stock = req.body.in_stock;

  const newProduct = new Product({
    id,
    category_id,
    owner_id,
    name,
    image_url,
    thumbnails,
    price,
    in_stock
  });

  newProduct.save()
    .then(() => res.json('Product added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

export default router;
