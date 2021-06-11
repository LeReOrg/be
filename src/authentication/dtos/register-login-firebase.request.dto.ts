import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterAndLoginWithFirebaseRequestBodyDto {
  @IsEmail()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Email must be a string",
    example: "lere-app@yopmail.com",
  })
  email: string;

  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Firebase user ID",
    example: "gRiNWZdQuot1ITdCZjzN2avG72s2",
  })
  uid: string;

  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Display name of user",
    minLength: 8,
    example: "John Doe",
  })
  displayName: string;

  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Avatar of user",
    example: "http://placeimg.com/640/480",
  })
  avatar: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({
    description: "Avatar of user",
    required: false,
    example: true,
  })
  emailVerified: boolean;
}
