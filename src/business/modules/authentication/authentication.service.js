import { UsersRepository } from "./../users/users.repository";
import { ConfigModule } from "../../../share/modules/config/config.module";
import { BadRequestError } from "../../../share/errors";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export class AuthenticationService {
  #usersRepository;
  #jwtSecretKey;

  constructor() {
    this.#usersRepository = new UsersRepository();

    const jwtConfig = ConfigModule.retrieveConfig("jwt");
    this.#jwtSecretKey = jwtConfig.secretKey;
  };

  createToken = (data) => {
    return jwt.sign(data, this.#jwtSecretKey);
  };

  fireBaseLogin = async (data) => {
    const user = await this.#usersRepository.upsertOne({ uid: data.uid }, data);
    const token = this.createToken({ email: user.email });
    return { token, user };
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
    const user = await this.#usersRepository.findOne({ email });
    return !!user;
  };

  isMatchedPassword = (password, hash, salt) => {
    const newHash = this.hashPassword(password, salt);
    return newHash === hash;
  };

  register = async (email, password, others) => {
    const isDuplicatedEmail = await this.isDuplicatedEmail(email);

    if (isDuplicatedEmail) {
      throw new BadRequestError("Duplicated Email");
    }

    const salt = this.generateSalt(16);
    const hash = await this.hashPassword(password);

    const user = this.#usersRepository.constructManualAuthenticationData({
      ...others,
      email,
      salt,
      hash,
    });

    await this.#usersRepository.save(user);

    return { status: "OK" };
  };

  extractAndValidateLoggingUser = async (email, password) => {
    const user = await this.#usersRepository.findOne({ email });

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