import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserAddressDto {
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
