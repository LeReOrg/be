import authenticationService from "./authentication.service";
import {
  firebaseLoginSchema,
  registerSchema,
  loginSchema,
  selfChangePasswordSchema,
  sendForgotPasswordEmailSchema,
  verfiyOtpCodeSchema,
  resetPasswordSchema,
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
    requestedBy.resetPasswordOtpCode = undefined;
    return requestedBy;
  };

  selfChangePassword = async ({ reqBody, requestedBy }) => {
    const { password, newPassword } = await selfChangePasswordSchema.validateAsync(reqBody);
    return authenticationService.selfChangePassword(password, newPassword, requestedBy);
  };

  sendForgotPasswordEmail = async ({ reqBody }) => {
    const { email } = await sendForgotPasswordEmailSchema.validateAsync(reqBody);
    return authenticationService.sendForgotPasswordEmail(email);
  };

  verifyOtpCode = async ({ reqBody, requestedBy }) => {
    const { otpCode } = await verfiyOtpCodeSchema.validateAsync(reqBody);
    return authenticationService.verifyOtpCode(otpCode, requestedBy);
  }

  resetPassword = async ({ reqBody, requestedBy }) => {
    const { password } = await resetPasswordSchema.validateAsync(reqBody);
    return authenticationService.resetPassword(password, requestedBy);
  };
};

const authenticationController = new AuthenticationController();

Object.freeze(authenticationController);

export default authenticationController;