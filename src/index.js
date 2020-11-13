import express from "express";
import cors from "cors";
import MongoClient from "mongodb"; 

import models from './models';
import routes from './routes';

const app = express();
const PORT = 3000;
const connectionString = 'mongodb+srv://npdoan1996:1npoyZqDpq6FK5VF@leaseandrent.k1rme.mongodb.net/<dbname>?retryWrites=true&w=majority'

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

MongoClient.connect(connectionString, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to Database')
  })
  .catch(error => console.error(error))

app.listen(process.env.PORT || 3000, () =>
  console.log(`Express server currently running on port ${PORT}`)
);
