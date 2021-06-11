import { IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class VerifyOtpCodeRequestBodyDto {
  @IsString()
  @MinLength(6)
  @Matches(/^\d+$/)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "OTP code for reset password",
    minLength: 6,
    example: "123456",
  })
  otpCode: string;
}
