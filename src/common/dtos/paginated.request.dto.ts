import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { UtilsHelper } from "../helpers/utils.helper";
import { PaginatedDefaultOptions } from "../../common/enums/paginated-default-options";

export class PaginatedRequestDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 10, default: PaginatedDefaultOptions.Limit })
  limit?: number = PaginatedDefaultOptions.Limit;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ example: 1, default: PaginatedDefaultOptions.Page })
  page?: number = PaginatedDefaultOptions.Page;

  @IsOptional()
  @Transform((params) => UtilsHelper.formatSortOptions(params.value))
  @ApiPropertyOptional({ example: "name:asc,price:desc" })
  // Fake type to work properly with swagger. Real type is: Record<string, string>
  sort?: string;
}
