export default class BaseError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    const args = Object.values({ ...params });

    if (args.length === 2) {
      this.code = args[0];
      this.message = args[1];
    }
  }
};