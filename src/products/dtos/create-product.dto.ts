import { DiscountDto } from "./discount.dto";
import { LocationDto } from "./location.dto";
import { UploadProductImageDto } from "./upload-product-image.dto";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export class CreateProductDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  quantity: number;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  depositPrice: number;

  @IsNumber()
  @ApiProperty()
  shortestHiredDays: number;

  @IsBoolean()
  @ApiPropertyOptional()
  isTopProduct?: boolean;

  @IsString()
  @IsMongoId()
  @ApiProperty()
  categoryId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiscountDto)
  @ApiPropertyOptional({ type: [DiscountDto] })
  discounts?: DiscountDto[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Transform((params) =>
    params.value.map((value) => {
      if (typeof value === "string") {
        return { base64: value };
      }
      return value;
    }),
  )
  @ApiProperty({ type: [UploadProductImageDto] })
  images: UploadProductImageDto[];
}
