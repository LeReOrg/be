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

// getProductByCategory()
app.get('/products/:categoryId', (req, res) => {
  res.send(models.products[req.params["categoryId"]]);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
