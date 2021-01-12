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

  Product.find()
    .skip(pageOptions.page * pageOptions.limit)
    .limit(pageOptions.limit)
    .exec(function (err, product) {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.status(200).json(product);
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

export default router;
