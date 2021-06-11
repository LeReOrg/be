import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryImage } from "./schemas/cloudinary-image.schema";
import { CloudinaryConfig } from "../config/interfaces/cloudinary.config";

@Injectable()
export class CloudinaryService {
  constructor(private __configService: ConfigService) {
    this.__setConfig();
  }

  private __setConfig(): void {
    const config = this.__configService.get<CloudinaryConfig>("cloudinary");

    cloudinary.config({
      cloud_name: config?.cloudName,
      api_secret: config?.apiSecret,
      api_key: config?.apiKey,
    });
  }

  public async uploadBase64(
    base64: string,
    options?: {
      folder?: string;
      publicId?: string;
    },
  ): Promise<CloudinaryImage> {
    const env = this.__configService.get<string>("environment");

    const finalOptions: {
      folder: string;
      overwrite: true;
      public_id?: string;
    } = {
      folder: `LereApp/${env}`,
      overwrite: true,
    };

    if (options) {
      if (options.folder) {
        finalOptions.folder += `/${options.folder}`;
      }
      if (options.publicId) {
        finalOptions.public_id = options.publicId.replace(finalOptions.folder + "/", "");
      }
    }

    const result = await cloudinary.uploader.upload(base64, finalOptions);

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  }

  public async uploadCategoryImage(base64: string, publicId?: string): Promise<CloudinaryImage> {
    return this.uploadBase64(base64, { folder: "Categories", publicId });
  }

  public async uploadProductImage(productId: string, base64: string): Promise<CloudinaryImage> {
    return this.uploadBase64(base64, {
      folder: "Products/" + productId,
    });
  }
}
