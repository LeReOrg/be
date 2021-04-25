import { UnauthorizedError } from "../../../share/errors";
import authenticationService from "./authentication.service";

const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
};

const authenticationMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new UnauthorizedError("Missing token");
    }

    const user = await authenticationService.getUserByToken(token);

    if (!user) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = user;

    return next();

  } catch (err) {
    return res.status(401).send({
      errorCode: 401,
      errorMessage: err.message,
    });
  }
};

export default authenticationMiddleware;