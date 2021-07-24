import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

@Exclude()
export class IncomeFeeDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  type: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  rate: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  amount: number;
}
