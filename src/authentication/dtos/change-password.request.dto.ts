import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class ChangePasswordRequestBodyDto {
  @IsString()
  @MinLength(8)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Current password of user",
    minLength: 8,
    example: "abcd1234",
  })
  password: string;

  @IsString()
  @MinLength(8)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "New password that user want to change",
    minLength: 8,
    example: "abcd12345",
  })
  newPassword: string;
}
