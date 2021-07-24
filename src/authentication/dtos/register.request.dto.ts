import { LoginRequestBodyDto } from "./login.request.dto";
import { IsEnum, IsOptional, IsString, Matches } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../../users/enums/role.enum";

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

  @IsOptional()
  @IsString()
  @IsEnum(Role)
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Role",
    example: "Admin",
    required: false,
    enum: Role,
  })
  role?: string;
}
