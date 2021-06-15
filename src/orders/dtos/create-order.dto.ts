import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNumber, MinDate } from "class-validator";
import * as moment from "moment";

export class CreateOrderDto {
  @Type(() => String)
  @IsMongoId()
  @ApiProperty()
  productId: string;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  quantity: number;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date(moment().format("YYYY-MM-DD")))
  @ApiProperty()
  endDate: Date;
}
