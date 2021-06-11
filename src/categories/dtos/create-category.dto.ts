import { IsString } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Category name",
    example: "Tent",
  })
  name: string;

  @IsString()
  @Type(() => String)
  @Transform((param) => param.value.trim())
  @ApiProperty({
    description: "Category image in base64 format",
    example:
      "data:image/jpeg;base64,/9j/4SKXRXhpZgAATU0AKgAAAAgADAEAAAMAAAABAlg" +
      "AAAEBAAMAAAABAlcAAAECAAMAAAADAAAAngEGAAMAAAABAAIAAAESAAMAAAABAAEAA" +
      "AEVAAMAAAABAAMAAAEaAAUAAAABAAAApAEbAAUAAAABAAAArAEoAAMAAAABAAIAAAE" +
      "xAAIAAACbAAAAtAEyAAIAAAAUAAABUIdpAAQAAAABAAABZAAAAaYACAAIAAgACvyAA" +
      "AAnEAAK/",
  })
  thumbnail: string;
}
