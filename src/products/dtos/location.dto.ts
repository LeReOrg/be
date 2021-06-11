import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

@Exclude()
export class LocationDto {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 10.8014577 })
  latitude: number;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 106.6348131 })
  longitude: number;

  @Expose()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: "221B Baker Street" })
  address: string;

  @Expose()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: "Marlene" })
  ward: string;

  @Expose()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: "Anklebone" })
  district: string;

  @Expose()
  @IsString()
  @Type(() => String)
  @ApiProperty({ example: "Londrina" })
  city: string;
}
