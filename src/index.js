import express from "express";
import { ConfigModule } from "./share/modules/config/config.module";
import { LoggerModule } from "./share/modules/logger/logger.module";
import { DatabaseModule } from "./share/modules/database/database.module";
import { CloudinaryModule } from "./share/modules/cloudinary/cloudinary.module";
import CategoriesModule from "./business/modules/categories/categories.module";
import ProductsModule from "./business/modules/products/products.module";
import AuthenticationModule from "./business/modules/authentication/authentication.module";

// // TODO: remove 3 lines below
// import cors from "cors";
// import routes from './routes';
// import sendEmail from "./send-email";

const config = ConfigModule.retrieveConfig();

// Logger
const logger = new LoggerModule("Express");

// Database
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const databaseModule = new DatabaseModule(config.mongoDbUrl, mongooseOptions);
databaseModule.connect();

// Cloudinary
const cloudinaryModule = new CloudinaryModule(config.cloudinary);
cloudinaryModule.config();

// Express
const app = express();

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Write a middleware file for this
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/health-check", (req, res) => res.send("OK"));

const pathPrefix = "/api/v1";
app.use(pathPrefix + "/categories", CategoriesModule);
app.use(pathPrefix + "/products", ProductsModule);
app.use(pathPrefix + "/authentication", AuthenticationModule);

// app.use(function (err, req, res, next) {
//   if (err.name === 'UnauthorizedError') {
//     res.status(401).send('invalid token...');
//   }
// });

app.listen(config.port, logger.info(`Server is listening on port ${config.port}`));