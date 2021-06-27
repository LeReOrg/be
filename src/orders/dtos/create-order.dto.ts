import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNumber, Min, MinDate } from "class-validator";
import * as moment from "moment";

export class CreateOrderDto {
  @Type(() => String)
  @IsMongoId()
  @ApiProperty()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ minimum: 1 })
  quantity: number;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty({ format: "date" })
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty({ format: "date" })
  endDate: Date;
}
