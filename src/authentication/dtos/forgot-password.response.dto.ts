import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordResponseBodyDto {
  @ApiProperty({
    description: "Token that use to validate reset password request",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx2a2J" +
      "pbmh0ZXN0MUBnbWFpbC5jb20iLCJpYXQiOjE2MjIxMDgxMDR9" +
      ".ztNtoOHR2ityCWXz5sOkusA0gyFiztJt-Kd-xaGmK9o",
  })
  token: string;
}
