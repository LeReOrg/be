import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CloudinaryImageDto } from "../../cloudinary/dtos/cloudinary-image.dtos";
import { DiscountDto } from "./discount.dto";
import { UserDto } from "../../users/dtos/user.dto";
import { CategoryDto } from "../../categories/dtos/category.dto";
import { BreadcrumbDto } from "./breadcrumb.dto";
import { AddressDto } from "../../addresses/dtos/address.dto";

@Exclude()
export class ProductDto {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  depositPrice: number;

  @Expose()
  @ApiProperty()
  shortestHiredDays: number;

  @Expose()
  @ApiProperty()
  isTopProduct: boolean;

  @Expose()
  @ApiProperty()
  term: string;

  @Expose()
  @ApiProperty()
  requiredLicenses: Record<string, any>[];

  @Expose()
  @Type(() => BreadcrumbDto)
  @ApiProperty({ type: [BreadcrumbDto] })
  breadcrumbs: BreadcrumbDto[];

  @Expose()
  @Type(() => DiscountDto)
  @ApiProperty({ type: [DiscountDto] })
  discounts: DiscountDto[];

  @Expose()
  @Type(() => CloudinaryImageDto)
  @ApiProperty({ type: [CloudinaryImageDto] })
  images: CloudinaryImageDto[];

  @Expose()
  @Type(() => CategoryDto)
  @ApiProperty({ type: CategoryDto })
  category: CategoryDto;

  @Expose()
  @Type(() => UserDto)
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @Expose()
  @Type(() => AddressDto)
  @ApiProperty({ type: AddressDto })
  address: AddressDto;

  @Expose()
  @ApiProperty({ example: "2021-06-02T07:53:00.865Z" })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: "2021-06-02T07:53:00.865Z" })
  updatedAt: Date;
}
