import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateUserAddressDto {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fullName?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  phoneNumber?: string;

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

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isDefaultAddress?: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isPickupAddress?: boolean;

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ required: false })
  isShippingAddress?: boolean;
}
