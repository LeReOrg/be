import { PaginatedRequestDto } from "../../common/dtos/paginated.request.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PaginatedProductsRequestDto extends PaginatedRequestDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional({ example: "50000-10000" })
  price?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiPropertyOptional({ example: "Ha Noi, New York" })
  cities?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiPropertyOptional({ example: true })
  isTopProduct?: boolean;
}
