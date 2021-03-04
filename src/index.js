import express from "express";
import cors from "cors";
import mongoose from "mongoose"; 
import sendEmail from "./send-email";
require('dotenv').config();

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Modular routes
app.use('/category', routes.category);
app.use('/product', routes.product);
app.use('/user', routes.user);
app.use('/cart', routes.cart);

// Database Initialization
const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// hello world
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () =>
  console.log(`Express server currently running on port ${port}`)
);
