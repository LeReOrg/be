import { UserDto } from "../../users/dtos/user.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseBodyDto {
  @ApiProperty({
    description: "Token that use to validate request and identify user",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx2a2J" +
      "pbmh0ZXN0MUBnbWFpbC5jb20iLCJpYXQiOjE2MjIxMDgxMDR9" +
      ".ztNtoOHR2ityCWXz5sOkusA0gyFiztJt-Kd-xaGmK9o",
  })
  token: string;

  @Type(() => UserDto)
  @ApiProperty({
    description: "Logged in user information",
    type: UserDto,
  })
  user: UserDto;
}
