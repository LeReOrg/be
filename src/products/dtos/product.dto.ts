import { Exclude, Expose, Type } from "class-transformer";
import { ApiResponseProperty } from "@nestjs/swagger";
import { CloudinaryImageDto } from "../../cloudinary/dtos/cloudinary-image.dtos";
import { DiscountDto } from "./discount.dto";
import { LocationDto } from "./location.dto";
import { UserDto } from "../../users/dtos/user.dto";
import { CategoryDto } from "../../categories/dtos/category.dto";

@Exclude()
export class ProductDto {
  @Expose()
  @ApiResponseProperty()
  _id: string;

  @Expose()
  @ApiResponseProperty()
  name: string;

  @Expose()
  @ApiResponseProperty()
  price: number;

  @Expose()
  @ApiResponseProperty()
  quantity: number;

  @Expose()
  @ApiResponseProperty()
  description: string;

  @Expose()
  @ApiResponseProperty()
  depositPrice: number;

  @Expose()
  @ApiResponseProperty()
  shortestHiredDays: number;

  @Expose()
  @ApiResponseProperty()
  isTopProduct: boolean;

  @Expose()
  @ApiResponseProperty()
  breadcrumb: string;

  @Expose()
  @Type(() => CategoryDto)
  @ApiResponseProperty({ type: CategoryDto })
  category: CategoryDto;

  @Expose()
  @Type(() => UserDto)
  @ApiResponseProperty({ type: UserDto })
  user: UserDto;

  @Expose()
  @Type(() => LocationDto)
  @ApiResponseProperty({ type: LocationDto })
  location: LocationDto;

  @Expose()
  @Type(() => DiscountDto)
  @ApiResponseProperty({ type: [DiscountDto] })
  discounts: DiscountDto[];

  @Expose()
  @Type(() => CloudinaryImageDto)
  @ApiResponseProperty({ type: [CloudinaryImageDto] })
  images: CloudinaryImageDto[];

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  createdAt: Date;

  @Expose()
  @ApiResponseProperty({ example: "2021-06-02T07:53:00.865Z" })
  updatedAt: Date;
}
