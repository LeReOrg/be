import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { UtilsHelper } from "../helpers/utils.helper";
import { PaginatedDefaultOptions } from "../../common/enums/paginated-default-options";

export class PaginatedRequestDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ default: PaginatedDefaultOptions.Limit })
  limit: number = PaginatedDefaultOptions.Limit;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ default: PaginatedDefaultOptions.Page })
  page: number = PaginatedDefaultOptions.Page;

  @Transform((params) => UtilsHelper.formatSortOptions(params.value))
  @IsOptional()
  @ApiPropertyOptional({ example: "name:asc,price:desc", type: String })
  sort?: Record<string, string>;
}
