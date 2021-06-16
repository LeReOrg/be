import { PaginatedRequestDto } from "../../common/dtos/paginated.request.dto";
import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { OrderPopulate } from "../enums/order-populate";
import { OrderStatus } from "../enums/order-status";

export class FilterOrdersDto extends PaginatedRequestDto {
  @Type(() => String)
  @Transform((params) => params.value.split(","))
  @IsOptional()
  @IsEnum(OrderPopulate, { each: true })
  @ApiProperty({
    required: false,
    type: String,
    example:
      `${OrderPopulate.Product},${OrderPopulate.Lessor},${OrderPopulate.Lessee},` +
      `${OrderPopulate.LessorAddress},${OrderPopulate.LesseeAddress}`,
  })
  populate?: string[];

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiProperty({ required: false })
  productId?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiProperty({ required: false })
  lessorId?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsMongoId()
  @ApiProperty({ required: false })
  lesseeId?: string;

  @Type(() => String)
  @IsOptional()
  @IsString()
  @IsEnum(OrderStatus)
  @ApiProperty({ required: false, enum: OrderStatus })
  status?: string;
}
