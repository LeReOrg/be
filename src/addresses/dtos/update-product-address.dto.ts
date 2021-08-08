import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateProductAddressDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  latitude?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  longitude?: number;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  street?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  ward?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  district?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  province?: string;
}
