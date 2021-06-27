import { DiscountDto } from "./discount.dto";
import { UploadProductImageDto } from "./upload-product-image.dto";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { BreadcrumbDto } from "./breadcrumb.dto";
import { CreateProductAddressDto } from "../../addresses/dtos/create-product-address.dto";
export class CreateProductDto {
  @Type(() => String)
  @IsString()
  @IsMongoId()
  @ApiProperty()
  categoryId: string;

  @Type(() => String)
  @Transform((param) => param.value.trim())
  @IsString()
  @ApiProperty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  quantity: number;

  @Type(() => String)
  @IsString()
  @ApiProperty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  depositPrice: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ minimum: 0 })
  shortestHiredDays: number;

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
  @IsArray()
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: [DiscountDto] })
  discounts?: DiscountDto[];

  @Type(() => CreateProductAddressDto)
  @ValidateNested()
  @IsOptional()
  @ApiPropertyOptional({ type: CreateProductAddressDto })
  address?: CreateProductAddressDto;
}
