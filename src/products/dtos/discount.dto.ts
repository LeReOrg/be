import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

@Exclude()
export class DiscountDto {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ minimum: 0 })
  days: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ minimum: 0 })
  discount: number;
}
