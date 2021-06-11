import { LoginRequestBodyDto } from "./login.request.dto";
import { IsString, Matches } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestBodyDto extends LoginRequestBodyDto {
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
  @Matches(/^\d+$/)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Phone number must be a string",
    example: "0987654321",
    required: false,
  })
  phoneNumber: string;
}
