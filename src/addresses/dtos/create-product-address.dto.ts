import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductAddressDto {
  @Type(() => String)
  @IsString()
  @ApiProperty()
  fullName: string;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  phoneNumber: string;

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
  @IsString()
  @ApiProperty()
  street: string;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  ward: string;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  district: string;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  province: string;
}
