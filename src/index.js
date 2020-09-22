import express from "express";
import cors from "cors";

import models from './models';
import routes from './routes';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Modular routes
app.use('/categories', routes.category)
app.use('/products', routes.product);

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// // getCategory()
// app.get('/categories', (req, res) => {
//   res.send(models.categories);
// });

// getTopProduct()
app.get('/topProducts', (req, res) => {
  res.send(models.products);
});

// // filter products by price: increase
// app.get('/products/filterByPrice/inc', (req, res) => {
//   let sortable = [];
//   for (let product in models.products) {
//     sortable.push(models.products[product])
//   }
//   sortable.sort(function (v1, v2) {
//     if(v1.price < v2.price) { return -1; }
//     if(v1.price > v2.price) { return 1; }
//     return 0;
//   });
//   res.send(sortable);
// });

// // filter products by price: decrease
// app.get('/products/filterByPrice/dec', (req, res) => {
//   let sortable = [];
//   for (let product in models.products) {
//     sortable.push(models.products[product])
//   }
//   sortable.sort(function (v1, v2) {
//     if(v1.price > v2.price) { return -1; }
//     if(v1.price < v2.price) { return 1; }
//     return 0;
//   });
//   res.send(sortable);
// });

// // getProductByCategory()
// app.get('/products/:categoryId', (req, res) => {
//   let products = [];
//   for (let product in models.products) {
//     if (models.products[product].category_id === req.params["categoryId"]) {
//       products.push(models.products[product])
//     }
//   }
//   res.send(products);
// });

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
