import cloudinaryLib from "cloudinary";
import { ConfigModule } from "../config/config.module";

const cloudinary = cloudinaryLib.v2;

export class CloudinaryService {
  #folderPrefix = ConfigModule.retrieveConfig("env");

  uploadBase64 = async (base64, customOptions) => {
    const options = {
      folder: `LereApp/${this.#folderPrefix}`,
      overwrite: true,
    };
    if (customOptions.folder) {
      options.folder += `/${customOptions.folder}`;
    }
    if (customOptions.publicId) {
      options.public_id = customOptions.publicId.replace(options.folder + "/", "");
    }
    const result = await cloudinary.uploader.upload(base64, options);
    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  };
};