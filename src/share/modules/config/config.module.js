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
  }

  static retrieveConfig(key) {
    if (!key) return this.#config;
    else return this.#config[key];
  }
};