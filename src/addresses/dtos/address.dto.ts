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
  type: string;

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
}
