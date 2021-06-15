import { ProductDto } from "../../products/dtos/product.dto";
import { UserDto } from "../../users/dtos/user.dto";
import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { AddressDto } from "../../addresses/dtos/address.dto";

@Exclude()
export class OrderDto {
  @Expose()
  @Type(() => String)
  @ApiProperty()
  _id: string;

  @Expose()
  @Type(() => ProductDto)
  @ApiProperty()
  product: ProductDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  lessor: UserDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty()
  lessee: UserDto;

  @Expose()
  @Type(() => AddressDto)
  @ApiProperty()
  lessorAddress: AddressDto;

  @Expose()
  @Type(() => AddressDto)
  @ApiProperty()
  lesseeAddress: AddressDto;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  thumbnailUrl: string;

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
  quantity: number;

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
