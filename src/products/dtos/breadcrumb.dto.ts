import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsMongoId, IsOptional, IsString } from "class-validator";

@Exclude()
export class BreadcrumbDto {
  @Expose()
  @Type(() => String)
  @IsString()
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => String)
  @IsString()
  @ApiProperty()
  url: string;

  @Expose()
  @Type(() => String)
  @IsMongoId()
  @IsOptional()
  @ApiPropertyOptional()
  categoryId?: string;
}
