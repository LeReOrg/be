import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { OrderDto } from "../../orders/dtos/order.dto";
import { IncomeFeeDto } from "../../income-fees/dtos/income-fee.dto";

@Exclude()
export class IncomeDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  _id: string;

  @Expose()
  @Type(() => OrderDto)
  @ApiProperty({ type: OrderDto })
  order: OrderDto;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  lesseePaid: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  lessorEarned: number;

  @Expose()
  @Type(() => IncomeFeeDto)
  @ApiProperty({ type: [IncomeFeeDto] })
  fees: IncomeFeeDto[];

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
