import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";

export class ResetPasswordRequestBodyDto {
  @IsString()
  @MinLength(8)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "New password that user want to change to",
    minLength: 8,
    example: "abcd1234",
  })
  password: string;
}
