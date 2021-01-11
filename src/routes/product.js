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
    let sortable = [];
    for (let product in models.products) {
      sortable.push(models.products[product])
    }
    sortable.sort(function (v1, v2) {
      if(v1.price < v2.price) { return -1; }
      if(v1.price > v2.price) { return 1; }
      return 0;
    });
    res.send(sortable);
});

// filter products by price: decrease
router.get('/filterByPrice/dec', (req, res) => {
    let sortable = [];
    for (let product in models.products) {
      sortable.push(models.products[product])
    }
    sortable.sort(function (v1, v2) {
      if(v1.price > v2.price) { return -1; }
      if(v1.price < v2.price) { return 1; }
      return 0;
    });
    res.send(sortable);
});
  
// getProductByCategoryId()
router.get('/getProductByCategoryId/:categoryId', (req, res) => {
    let products = [];
    for (let product in models.products) {
      if (models.products[product].category_id === req.params["categoryId"]) {
        products.push(models.products[product])
      }
    }
    res.send(products);
});

// getProductById
router.get('/getProductById/:Id', (req, res) => { 
    for (let product in models.products) { 
      if (models.products[product].id === req.params["Id"]) {
        res.send(models.products[product])
        break
      }
    }
})

export default router;
