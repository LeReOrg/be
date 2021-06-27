import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { CloudinaryImageDto } from "../../cloudinary/dtos/cloudinary-image.dtos";
import { DiscountDto } from "../../products/dtos/discount.dto";
import { ProductDto } from "../../products/dtos/product.dto";

@Exclude()
export class OrderDetailDto {
  @Expose()
  @Type(() => ProductDto)
  @ApiProperty({ type: ProductDto })
  product: ProductDto;

  @Expose()
  @Type(() => String)
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  quantity: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  unitPrice: number;

  @Expose()
  @Type(() => Number)
  @ApiProperty()
  unitDeposit: number;

  @Expose()
  @Type(() => DiscountDto)
  @ApiProperty({ required: false, type: DiscountDto })
  discount?: DiscountDto;

  @Expose()
  @Type(() => CloudinaryImageDto)
  @ApiProperty({ type: CloudinaryImageDto })
  thumbnail: CloudinaryImageDto;
}
