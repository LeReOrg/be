import { PaginatedRequestDto } from "../../common/dtos/paginated.request.dto";
import { IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class FilterUserAddressesDto extends PaginatedRequestDto {
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
