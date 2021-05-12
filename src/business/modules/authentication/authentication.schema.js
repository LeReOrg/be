import Joi from "joi";

const email = Joi.string()
  .required()
  .email()
  .trim();

const password = Joi.string()
  .required()
  .trim()
  .min(8);
  // .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/);

export const firebaseLoginSchema = Joi.object().keys({
  email: Joi.string()
    .required(),
  
  uid: Joi.string()
    .required(),

  displayName: Joi.string()
    .required(),
  
  avatar: Joi.string()
    .required(),
  
  emailVerified: Joi.boolean()
    .optional(),
});

export const loginSchema = Joi.object().keys({
  email,

  password,
});

export const registerSchema = loginSchema.keys({
  displayName: Joi.string()
    .required()
    .trim(),

  phoneNumber: Joi.string()
    .optional()
    .regex(/^\d+$/),
});

export const selfChangePasswordSchema = Joi.object().keys({
  password,

  newPassword: password,
});

export const sendForgotPasswordEmailSchema = Joi.object().keys({
  email,
});

export const verfiyOtpCodeSchema = Joi.object().keys({
  otpCode: Joi.string()
    .required()
    .length(6)
});

export const resetPasswordSchema = Joi.object().keys({
  password,
});