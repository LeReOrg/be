import authenticationService from "./authentication.service";
import {
  firebaseLoginSchema,
  registerSchema,
  loginSchema,
  selfChangePasswordSchema,
} from "./authentication.schema";

class AuthenticationController {
  firebaseLogin = async ({ reqBody }) => {
    const input = await firebaseLoginSchema.validateAsync(reqBody);
    return authenticationService.fireBaseLogin(input);
  };

  register = async ({ reqBody }) => {
    const { email, password, ...others } = await registerSchema.validateAsync(reqBody);
    return authenticationService.register(email, password, others);
  };

  login = async ({ reqBody }) => {
    const { email, password } = await loginSchema.validateAsync(reqBody);
    return authenticationService.login(email, password);
  };

  getLoggedInUserProfile = async ({ requestedBy }) => {
    requestedBy.hash = undefined;
    requestedBy.salt = undefined;
    return requestedBy;
  };

  selfChangePassword = async({ reqBody, requestedBy }) => {
    const { password, newPassword } = await selfChangePasswordSchema.validateAsync(reqBody);
    return authenticationService.selfChangePassword(password, newPassword, requestedBy);
  };
};

const authenticationController = new AuthenticationController();

Object.freeze(authenticationController);

export default authenticationController;