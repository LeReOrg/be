import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserDto {
  @Expose()
  @ApiResponseProperty()
  _id: string;

  @Expose()
  @ApiResponseProperty({ example: "1b00cc65-eb4a-4f2c-9c71-5c1a312b4fd6" })
  uid: string;

  @Expose()
  @ApiResponseProperty({ example: "lere-app@yopmail.com" })
  email: string;

  @Expose()
  @ApiResponseProperty({ example: "John Doe" })
  displayName: string;

  @Expose()
  @ApiResponseProperty({ example: "0987654321" })
  phoneNumber: string;

  @Expose()
  @ApiResponseProperty({ example: "http://placeimg.com/640/480" })
  avatar: string;

  @Expose()
  @ApiResponseProperty({ example: "MALE" })
  gender: string;

  @Expose()
  @ApiResponseProperty({ example: "2021-04-25T00:00:00.000Z" })
  birthDay: Date;

  @Expose()
  @ApiResponseProperty({ example: false })
  isHirer: boolean;

  @Expose()
  @ApiResponseProperty({ example: "DRIVER" })
  role: string;

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  createdAt: Date;

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  updatedAt: Date;
}
