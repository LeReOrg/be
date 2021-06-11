import { IsEmail, IsString, MinLength } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class LoginRequestBodyDto {
  @IsEmail()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Email must be a string",
    example: "lere-app@yopmail.com",
  })
  email: string;

  @IsString()
  @MinLength(8)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Password must be a string and have at least 8 characters",
    minLength: 8,
    example: "abcd1234",
  })
  password: string;
}
