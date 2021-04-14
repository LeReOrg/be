import Joi from "joi";
import { getProductsSchema } from "../products/products.schema";
Joi.objectId = require('joi-objectid')(Joi);

export const createCategory = Joi.object({
  name: Joi.string()
    .required()
    .trim(),

  thumbnail: Joi.string()
    .required()
    .dataUri()
    .trim(),
});

export const updateCategory = Joi.object().keys({
  categoryId: Joi.objectId()
    .required(),

  name: Joi.string()
    .optional()
    .trim(),

  thumbnail: Joi.string()
    .optional()
    .dataUri()
    .trim(),

}).or("name", "thumbnail");

export const getProductsByCategoryId = getProductsSchema.keys({
  categoryId: Joi.objectId()
    .required(),
});