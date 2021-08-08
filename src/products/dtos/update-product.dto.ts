import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { DiscountDto } from "./discount.dto";
import { BreadcrumbDto } from "./breadcrumb.dto";
import { UpdateProductAddressDto } from "../../addresses/dtos/update-product-address.dto";
import { UploadProductImageDto } from "./upload-product-image.dto";

export class UpdateProductDto {
  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiPropertyOptional()
  categoryId?: string;

  @Type(() => String)
  @Transform((param) => param.value.trim())
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ minimum: 0 })
  price?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ minimum: 0 })
  quantity?: number;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ minimum: 0 })
  depositPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ minimum: 0 })
  shortestHiredDays?: number;

  @Transform((params) =>
    params.value.map((value) => {
      if (typeof value === "string") {
        return { base64: value };
      }
      return value;
    }),
  )
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @ApiPropertyOptional({
    type: [UploadProductImageDto],
    description: "NOTE: Only put NEW images into this field",
  })
  images?: UploadProductImageDto[];

  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isTopProduct?: boolean;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  label?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  term?: string;

  @Type(() => String)
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional()
  requiredLicenses?: string[];

  @Type(() => BreadcrumbDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ type: [BreadcrumbDto] })
  breadcrumbs?: BreadcrumbDto[];

  @Type(() => DiscountDto)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: [DiscountDto] })
  discounts?: DiscountDto[];

  @Type(() => UpdateProductAddressDto)
  @IsOptional()
  @ValidateNested()
  @IsObject()
  @ApiPropertyOptional({ type: UpdateProductAddressDto })
  address?: UpdateProductAddressDto;
}
