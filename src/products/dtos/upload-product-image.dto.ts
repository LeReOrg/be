import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UploadProductImageDto {
  @IsString()
  @Type(() => String)
  @ApiProperty()
  base64: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isLandingImage?: boolean;
}
