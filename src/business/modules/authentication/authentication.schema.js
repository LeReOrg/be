import Joi from "joi";

export const firebaseLoginSchema = Joi.object().keys({
  email: Joi.string()
    .required(),
  
  uid: Joi.string()
    .required(),

  displayName: Joi.string()
    .required(),
  
  avatar: Joi.string()
    .required(),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string()
    .required()
    .email()
    .trim(),

  password: Joi.string()
    .required()
    .trim()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/),
});

export const registerSchema = loginSchema.keys({
  displayName: Joi.string()
    .required()
    .trim(),

  phoneNumber: Joi.string()
    .optional()
    .regex(/^\d+$/),
});