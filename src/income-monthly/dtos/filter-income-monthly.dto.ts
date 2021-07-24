import { PaginatedRequestDto } from "../../common/dtos/paginated.request.dto";
import { IsDate, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class FilterIncomeMonthlyDto extends PaginatedRequestDto {
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, format: "date" })
  startDate: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @ApiProperty({ required: false, format: "date" })
  endDate: Date;
}
