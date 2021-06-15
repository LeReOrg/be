import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, ValidateNested } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class CreateOrdersDto {
  @Type(() => CreateOrderDto)
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [CreateOrderDto] })
  orders: CreateOrderDto[];

  @Type(() => String)
  @IsMongoId()
  @ApiProperty()
  address: string;
}
