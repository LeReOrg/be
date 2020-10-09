import express from "express";
import cors from "cors";

import models from './models';
import routes from './routes';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Modular routes
app.use('/category', routes.category);
app.use('/product', routes.product);
app.use('/user', routes.user);
app.use('/cart', routes.cart);

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
