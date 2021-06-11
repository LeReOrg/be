import { ApiResponseProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class PaginatedDto<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private type: Function;

  @Expose()
  @Type((options) => (options?.newObject as PaginatedDto<T>).type)
  @ApiResponseProperty()
  docs: T[];

  @Expose()
  @ApiResponseProperty({ example: 100 })
  totalDocs: number;

  @Expose()
  @ApiResponseProperty({ example: 10 })
  limit: number;

  @Expose()
  @ApiResponseProperty({ example: 2 })
  page?: number;

  @Expose()
  @ApiResponseProperty({ example: 10 })
  totalPages: number;

  @Expose()
  @ApiResponseProperty({ example: 3 })
  nextPage?: number | null;

  @Expose()
  @ApiResponseProperty({ example: 1 })
  prevPage?: number | null;

  @Expose()
  @ApiResponseProperty({ example: true })
  hasNextPage: boolean;

  @Expose()
  @ApiResponseProperty({ example: true })
  hasPrevPage: boolean;

  @Expose()
  @ApiResponseProperty()
  pagingCounter: number;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(type: Function) {
    this.type = type;
  }
}
