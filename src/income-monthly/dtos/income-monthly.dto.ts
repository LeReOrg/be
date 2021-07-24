import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class IncomeMonthlyDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  timestamp: Date;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  amount: number;
}
