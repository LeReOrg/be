import BaseError from "./base.error";

export default class BadRequestError extends BaseError {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestError)
    }
    this.name = "BadRequestError";
    this.httpStatusCode = 400;
  }
};