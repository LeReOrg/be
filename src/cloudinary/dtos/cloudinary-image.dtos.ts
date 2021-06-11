import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CloudinaryImageDto {
  @Expose()
  @ApiResponseProperty()
  publicId: string;

  @Expose()
  @ApiResponseProperty()
  url: string;
}
