"use strict";

var _express = _interopRequireDefault(require("express"));

var _config = require("./modules/config/config.module");

var _logger = require("./modules/logger/logger.module");

var _database = require("./modules/database/database.module");

var _products = _interopRequireDefault(require("./modules/products/products.module"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose"; 
// import sendEmail from "./send-email";
// require('dotenv').config();
// import routes from './routes';
// import DatabaseModule from "../src/modules/database/database.module";
// new DatabaseModule().init();
// const app = express();
// const port = process.env.PORT || 3000;
// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// // Modular routes
// app.use('/category', routes.category);
// app.use('/product', routes.product);
// app.use('/user', routes.user);
// app.use('/cart', routes.cart);
// // Database Initialization
// const uri = process.env.ATLAS_URI
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })
// // hello world
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
var config = _config.ConfigModule.retrieveConfig(); // Logger


var logger = new _logger.LoggerModule("Express"); // Database

var mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
var databaseModule = new _database.DatabaseModule(config.mongoDbUri, mongooseOptions);
databaseModule.connect(); // Express

var app = (0, _express["default"])();
app.use("/api/v1/products", _products["default"]);
app.get('/health-check', function (req, res) {
  return res.send("OK");
});
app.listen(config.port, logger.info("Server is listening on port ".concat(config.port)));