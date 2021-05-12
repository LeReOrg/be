import Joi from "joi";
import paginationSchema from "../../../share/joi-schemas/pagination.schema";
Joi.objectId = require('joi-objectid')(Joi);

export const getUsersSchema = Joi.object().keys({
  ...paginationSchema,

  sort: Joi.string()
    .optional(),
});

export const updateProfileSchema = Joi.object().keys({
  displayName: Joi.string()
    .required()
    .trim(),

  phoneNumber: Joi.string()
    .optional()
    .regex(/^\d+$/),

  gender: Joi.string()
    .optional()
    .uppercase()
    .valid("MALE", "FEMALE", "OTHER")
    .trim(),

  birthDay: Joi.date()
    .optional()
    .less("now"),

  isHirer: Joi.boolean()
    .optional(),
});