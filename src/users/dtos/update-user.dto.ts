import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsNumberString, IsOptional, IsString } from "class-validator";
import { Gender } from "../enums/gender.enum";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional()
  displayName?: string;

  @IsNumberString()
  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional()
  phoneNumber?: string;

  @IsString()
  @IsEnum(Gender)
  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional({ enum: Gender })
  gender?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  birthDay?: Date;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional()
  isHirer?: boolean;
}
