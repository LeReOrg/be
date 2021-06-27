import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNumber, IsOptional, Min, MinDate } from "class-validator";
import * as moment from "moment";

export class UpdateOrderDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false, minimum: 1 })
  quantity?: number;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty({ required: false, format: "date" })
  startDate?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty({ required: false, format: "date" })
  endDate?: Date;

  @Type(() => String)
  @IsOptional()
  @IsMongoId()
  @ApiProperty({ required: false })
  addressId?: string;
}
