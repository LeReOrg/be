import { UserDto } from "../../users/dtos/user.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "../../addresses/dtos/address.dto";
import { OrderDetailDto } from "../../order-details/dtos/order-detail.dto";

@Exclude()
export class OrderDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  _id: string;

  @Expose()
  @Type(() => OrderDetailDto)
  @ApiProperty({ type: OrderDetailDto })
  detail: OrderDetailDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty({ type: UserDto })
  lessor: UserDto;

  @Expose()
  @Type(() => AddressDto)
  @ApiProperty({ type: AddressDto })
  lessorAddress: AddressDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty({ type: UserDto })
  lessee: UserDto;

  @Expose()
  @Type(() => AddressDto)
  @ApiProperty({ type: AddressDto })
  lesseeAddress: AddressDto;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  hiredDays: number;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  startDate: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  endDate: Date;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  amount: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  deposit: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  status: string;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  createdDate: Date;

  @Expose()
  @Type(() => Date)
  @ApiProperty()
  updatedDate: Date;
}
