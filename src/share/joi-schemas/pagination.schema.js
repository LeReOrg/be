import Joi from "joi";

const paginationSchema = {
  page: Joi.number()
    .optional()
    .positive()
    .default(1),

  limit: Joi.number()
    .optional()
    .positive()
    .default(10),
};

export default paginationSchema;