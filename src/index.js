import express from "express";
import cors from "cors";

import models from './models';
import routes from './routes';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());

// Modular routes
app.use('/categories', routes.categories);
app.use('/products', routes.products);
app.use('/users', routes.users);
app.use('/carts', routes.carts);

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
