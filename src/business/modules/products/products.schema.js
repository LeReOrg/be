import Joi from "joi";
import paginationSchema from "../../../share/joi-schemas/pagination.schema";
Joi.objectId = require('joi-objectid')(Joi);

export const createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim(),

  price: Joi.number()
    .required()
    .min(0),

  quanlity: Joi.number()
    .required()
    .min(0),

  description: Joi.string()
    .required()
    .allow("")
    .trim(),

  depositPrice: Joi.number()
    .required()
    .min(0),

  shortestHiredDays: Joi.number()
    .required()
    .min(0),

  discounts: Joi.array().items(
    Joi.object({
      days: Joi.number().required(),
      discount: Joi.number().required()
    })
  ),

  categoryId: Joi.objectId()
    .required(),

  ownerId: Joi.string()
    .required()
    .trim(),

  brandId: Joi.string()
    .required()
    .trim(),

  images: Joi.array(),
    // .required()
    // .min(1)
    // .items(
    //   Joi.string()
    //     .dataUri()
    //     .trim(),
    // ),

  location: Joi.object({
    latitude: Joi.number()
      .required(),

    longtitude: Joi.number()
      .required(),

    address: Joi.string()
      .required(),

    ward: Joi.string()
      .required(),

    district: Joi.string()
      .required(),

    city: Joi.string()
      .required(),
  }).required(),
});

export const getProductsSchema = Joi.object().keys({
  ...paginationSchema,

  price: Joi.string()
    .optional(),

  cities: Joi.string()
    .optional(),

  sort: Joi.string()
    .optional()
    .lowercase(),
});