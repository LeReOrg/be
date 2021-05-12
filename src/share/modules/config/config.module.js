import { config } from "dotenv";
config();

export class ConfigModule {
  static #config = {
    env: process.env.ENVIRONMENT,
    port: process.env.PORT,
    mongoDbUrl: process.env.MONGODB_URL,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      apiKey: process.env.CLOUDINARY_API_KEY,
    },
    jwt: {
      secretKey: process.env.JWT_SECRET_KEY,
      otpSecretKey: process.env.JWT_OTP_SECRET_KEY,
    },
    mail: {
      service: process.env.MAIL_SERVICE,
      username: process.env.MAIL_USERNAME,
      password: process.env.MAIL_PASSWORD,
    },
  }

  static retrieveConfig(key) {
    if (!key) return this.#config;
    else return this.#config[key];
  }
};