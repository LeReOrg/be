import { ApiResponseProperty } from "@nestjs/swagger";

export class OkResponseBodyDto {
  @ApiResponseProperty({ example: "OK" })
  status: string;
}
