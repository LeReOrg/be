import BaseError from "./base.error";

export default class UnauthorizedError extends BaseError {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError)
    }
    this.name = "UnauthorizedError";
    this.httpStatusCode = 401;
  }
};