import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

@Exclude()
export class DiscountDto {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 3 })
  days: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 20 })
  discount: number;
}
