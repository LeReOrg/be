const cloudinary = require("cloudinary").v2;

export class CloudinaryModule {
  #cloudName
  #apiSecret
  #apiKey

  constructor({ cloudName, apiKey, apiSecret }) {
    this.#cloudName = cloudName;
    this.#apiSecret = apiSecret;
    this.#apiKey = apiKey;
  }

  config() {
    cloudinary.config({
      cloud_name: this.#cloudName,
      api_secret: this.#apiSecret,
      api_key: this.#apiKey,
    });
  }
};