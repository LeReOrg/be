import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class BalanceDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  _id: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  currentBalance: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
