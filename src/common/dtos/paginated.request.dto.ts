import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";
import { UtilsHelper } from "../helpers/utils.helper";
import { PaginatedDefaultOptions } from "../../common/enums/paginated-default-options";

export class PaginatedRequestDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ default: PaginatedDefaultOptions.Limit, minimum: 1 })
  limit: number = PaginatedDefaultOptions.Limit;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiPropertyOptional({ default: PaginatedDefaultOptions.Page, minimum: 1 })
  page: number = PaginatedDefaultOptions.Page;

  @Transform((params) => UtilsHelper.formatSortOptions(params.value))
  @IsOptional()
  @ApiPropertyOptional({ example: "name:asc,price:desc", type: String })
  sort?: Record<string, string>;
}
