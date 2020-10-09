import { Router } from 'express';
import models from '../models';

const router = Router();

//getTopProducts
router.get('/getTopProduct', (req, res) => {
  res.send(models.products);
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
