import { CloudinaryImageDto } from "../../cloudinary/dtos/cloudinary-image.dtos";
import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class CategoryDto {
  @Expose()
  @ApiResponseProperty({ example: "606f34915fe8ff1e68dc4a2b" })
  _id: string;

  @Expose()
  @ApiResponseProperty({ example: "Tent" })
  name: string;

  @Expose()
  @Type(() => CloudinaryImageDto)
  @ApiResponseProperty()
  thumbnail: CloudinaryImageDto;

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  createdAt: Date;

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  updatedAt: Date;
}
