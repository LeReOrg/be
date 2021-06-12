import { DiscountDto } from "./discount.dto";
import { LocationDto } from "./location.dto";
import { UploadProductImageDto } from "./upload-product-image.dto";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { BreadcrumbDto } from "./breadcrumb.dto";
export class CreateProductDto {
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @IsString()
  @ApiProperty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  depositPrice: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  shortestHiredDays: number;

  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional()
  isTopProduct?: boolean;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  term?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  requiredLicenses?: string;

  @Type(() => BreadcrumbDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [BreadcrumbDto] })
  breadcrumbs?: BreadcrumbDto[];

  @Type(() => LocationDto)
  @ValidateNested()
  @ApiProperty({ type: LocationDto })
  location: LocationDto;

  @Type(() => DiscountDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: [DiscountDto] })
  discounts?: DiscountDto[];

  @Transform((params) =>
    params.value.map((value) => {
      if (typeof value === "string") {
        return { base64: value };
      }
      return value;
    }),
  )
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [UploadProductImageDto] })
  images: UploadProductImageDto[];

  @Type(() => String)
  @IsString()
  @IsMongoId()
  @ApiProperty()
  categoryId: string;
}
