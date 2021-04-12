import Joi from "joi";
Joi.objectId = require('joi-objectid')(Joi);

const getProductsByCategoryId = Joi.object({
  categoryId: Joi.objectId()
    .required(),

  page: Joi.number()
    .optional()
    .positive()
    .default(1),

  limit: Joi.number()
    .optional()
    .positive()
    .default(10),
});

const createCategory = Joi.object({
  name: Joi.string()
    .required()
    .trim(),

  thumbnail: Joi.string()
    .required()
    .dataUri()
    .trim(),
});

const updateCategory = Joi.object().keys({
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


const validationSchema = {
  createCategory,
  updateCategory,
  getProductsByCategoryId,
};

export default validationSchema;