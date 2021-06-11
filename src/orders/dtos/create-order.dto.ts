import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNumber } from "class-validator";

export class CreateOrderDto {
  @IsMongoId()
  @Type(() => String)
  @ApiProperty()
  productId: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty()
  quantity: number;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date;
}
