import express from "express";
import cors from "cors";

import models from './models';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// getCategory()
app.get('/categories', (req, res) => {
  res.send(models.categories);
});

// getTopProduct()
app.get('/topProducts', (req, res) => {
  res.send(models.products);
});

// filter products by price: increase
app.get('/products/filterByPrice/inc', (req, res) => {
  var sortable = [];
  for (var product in models.products) {
    sortable.push([product, models.products[product]])
  }
  sortable.sort(function ([k1, v1], [k2, v2]) {
    if(v1.price < v2.price) { return -1; }
    if(v1.price > v2.price) { return 1; }
    return 0;
  });
  res.send(sortable);
});

// filter products by price: decrease
app.get('/products/filterByPrice/dec', (req, res) => {
  var sortable = [];
  for (var product in models.products) {
    sortable.push([product, models.products[product]])
  }
  sortable.sort(function ([k1, v1], [k2, v2]) {
    if(v1.price > v2.price) { return -1; }
    if(v1.price < v2.price) { return 1; }
    return 0;
  });
  res.send(sortable);
});

// getProductByCategory()
app.get('/products/:categoryId', (req, res) => {
  res.send(models.products[req.params["categoryId"]]);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
