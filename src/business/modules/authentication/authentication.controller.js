import { AuthenticationService } from "./authentication.service";
import {
  firebaseLoginSchema,
  registerSchema,
  loginSchema,
} from "./authentication.schema";

export class AuthenticationController {
  #service;

  constructor() {
    this.#service = new AuthenticationService();
  };

  firebaseLogin = async ({ reqBody }) => {
    const input = await firebaseLoginSchema.validateAsync(reqBody);
    return this.#service.fireBaseLogin(input);
  };

  register = async ({ reqBody }) => {
    const { email, password, ...others } = await registerSchema.validateAsync(reqBody);
    console.log({ email, password })
    return this.#service.register(email, password, others);
  };

  login = async ({ reqBody }) => {
    const { email, password } = await loginSchema.validateAsync(reqBody);
    return this.#service.login(email, password);
  };
};