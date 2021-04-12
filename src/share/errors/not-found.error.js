import BaseError from "./base.error";

export default class NotFoundError extends BaseError {
  constructor(...params) {
    super(...params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }
    this.name = "NotFoundError";
    this.httpStatusCode = 404;
  }
};