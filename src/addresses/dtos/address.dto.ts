import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class AddressDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  fullName: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty({ required: false })
  latitude?: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty({ required: false })
  longitude?: number;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  street: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  ward: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  district: string;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  province: string;

  @Expose()
  @ApiProperty({ required: false })
  isDefaultAddress?: boolean;

  @Expose()
  @ApiProperty({ required: false })
  isPickupAddress?: boolean;

  @Expose()
  @ApiProperty({ required: false })
  isShippingAddress?: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
