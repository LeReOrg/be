import { ConfigModule } from "../../../share/modules/config/config.module";
import { BadRequestError } from "../../../share/errors";
import usersRepository from "../users/users.repository";
import jwt from "jsonwebtoken";
import crypto from "crypto";

class AuthenticationService {
  #jwtSecretKey;

  constructor() {
    const jwtConfig = ConfigModule.retrieveConfig("jwt");
    this.#jwtSecretKey = jwtConfig.secretKey;
  };

  createToken = (data) => {
    const payload = { email: data.email };
    return jwt.sign(payload, this.#jwtSecretKey);
  };

  validateAndDecodeToken = (token) => {
    try {
      const decoded = jwt.verify(token, this.#jwtSecretKey);
      return decoded;
    } catch (err) {
      throw new BadRequestError("Invalid token");
    }
  };

  getUserByToken = async (token) => {
    const { email } = await this.validateAndDecodeToken(token);
    return usersRepository.findOne({ email }, { hash: 0, salt: 0 });
  };

  generateSalt = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

  hashPassword = (password, salt) => {
    return crypto.createHmac("sha512", salt)
      .update(password)
      .digest("hex");
  };

  isDuplicatedEmail = async (email) => {
    const user = await usersRepository.findOne({ email });
    return !!user;
  };

  isMatchedPassword = (password, hash, salt) => {
    const newHash = this.hashPassword(password, salt);
    return newHash === hash;
  };

  extractAndValidateLoggingUser = async (email, password) => {
    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new BadRequestError("Invalid email");
    }

    const isMatchedPassword = this.isMatchedPassword(
      password,
      user.hash,
      user.salt,
    );

    if (!isMatchedPassword) {
      throw new BadRequestError("Invalid password");
    }

    user.hash = undefined;
    user.salt = undefined;

    return user;
  };

  fireBaseLogin = async (data) => {
    const user = await usersRepository.upsertOne({ uid: data.uid }, data);
    const token = this.createToken({ email: user.email });
    return { token, user };
  };

  register = async (email, password, others) => {
    const isDuplicatedEmail = await this.isDuplicatedEmail(email);

    if (isDuplicatedEmail) {
      throw new BadRequestError("Duplicated Email");
    }

    const salt = this.generateSalt(16);
    const hash = await this.hashPassword(password);

    const user = usersRepository.constructManualAuthenticationData({
      ...others,
      email,
      salt,
      hash,
    });

    await usersRepository.save(user);

    return { status: "OK" };
  };

  login = async (email, password) => {
    try {
      const user = await this.extractAndValidateLoggingUser(email, password);
      const token = this.createToken({ email: user.email });
      return { token, user };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new BadRequestError("Login fail");
    }
  };
};

const authenticationService = new AuthenticationService();

Object.freeze(authenticationService);

export default authenticationService;