import Joi from "joi";
import paginationSchema from "../../../share/joi-schemas/pagination.schema";
Joi.objectId = require('joi-objectid')(Joi);

export const getUsersSchema = Joi.object().keys({
  ...paginationSchema,

  sort: Joi.string()
    .optional(),
});