import { PaginatedRequestDto } from "../../common/dtos/paginated.request.dto";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { ProductPopulate } from "../enums/product-populate";

export class FilterProductsDto extends PaginatedRequestDto {
  @Type(() => String)
  @Transform((params) => params.value.split(","))
  @IsOptional()
  @IsEnum(ProductPopulate, { each: true })
  @ApiPropertyOptional({
    type: String,
    example: `${ProductPopulate.Address},${ProductPopulate.Category},${ProductPopulate.User}`,
  })
  populate?: string[];

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  keyword?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "I.e:<br>" +
      "50000 : Greater than 50000<br>" +
      "-100000 : Less than 100000<br>" +
      "50000-100000 : From 50000 to 100000<br>",
  })
  priceRange?: string;

  @Transform((params) => params.value === "true")
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isTopProduct?: boolean;

  @Type(() => String)
  @Transform((params) => params.value.split(","))
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, description: "Split value by comma" })
  wards?: string[];

  @Type(() => String)
  @Transform((params) => params.value.split(","))
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, description: "Split value by comma" })
  districts?: string[];

  @Type(() => String)
  @Transform((params) => params.value.split(","))
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, description: "Split value by comma" })
  provinces?: string[];
}
