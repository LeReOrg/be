import { IsString } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordRequestBodyDto {
  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Email that used to receive OTP code",
    example: "lere-app@yopmail.com",
  })
  email: string;
}
