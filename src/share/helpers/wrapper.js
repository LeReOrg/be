import { BadRequestError, InternalServerError } from "../errors";
import { LoggerModule } from "../modules/logger/logger.module";

const logger = new LoggerModule();

const supportedErrorNames = ["BadRequestError", "NotFoundError"];

const handleError = (error, res) => {
  let returnedError = error;

  if (!supportedErrorNames.includes(returnedError.name)) {
    switch (returnedError.name) {
      case "ValidationError": {
        returnedError = new BadRequestError("ValidationError", error.message);
        break;
      }
      default: {
        logger.error(returnedError);
        returnedError = new InternalServerError("InternalServerError", "Unexpected error happened");
      }
    }
  }

  return res.status(returnedError.httpStatusCode).send({
    errorCode: returnedError.code,
    errorMessage: returnedError.message,
  });
};

const wrap = callback => async (req, res) => {
  try {
    const request = {};

    if (req.body) request.reqBody = req.body;
    if (req.query) request.reqQuery = req.query;
    if (req.params) request.reqParams = req.params;

    const result = await callback(request);

    const httpStatusCode = req.method === "POST" ? 201: 200;

    return res.status(httpStatusCode).send(result);

  } catch (error) {
    return handleError(error, res);
  }
};

export default wrap;