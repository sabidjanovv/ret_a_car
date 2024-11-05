import {
  IsInt,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDiscountDto {
//   @ApiProperty({ description: "Chegirma egasining ID raqami", example: 1 })
//   @IsInt({ message: "owner_id butun son bo'lishi kerak" })
//   owner_id: number;

  @ApiProperty({ description: "Yagona chegirma kodi", example: "SAVE20" })
  @IsString({ message: "discount_code satr bo'lishi kerak" })
  @Length(3, 20, {
    message: "discount_code 3 dan 20 belgigacha bo'lishi kerak",
  })
  discount_code: string;

  @ApiProperty({ description: "Chegirma foiz qiymati (1-100)", example: 20 })
  @IsNumber({}, { message: "discount_percentage raqam bo'lishi kerak" })
  @Min(1, { message: "discount_percentage kamida 1 bo'lishi kerak" })
  @Max(100, { message: "discount_percentage 100 dan oshmasligi kerak" })
  discount_percentage: number;

  @ApiProperty({
    description: "Chegirma boshlanish sanasi (YYYY-MM-DD formatida)",
    example: "2024-11-01",
  })
  @IsDateString(
    {},
    { message: "from_date YYYY-MM-DD formatida to'g'ri sanani kiriting" }
  )
  from_date: string;

  @ApiProperty({
    description: "Chegirma tugash sanasi (YYYY-MM-DD formatida)",
    example: "2024-11-30",
  })
  @IsDateString(
    {},
    { message: "to_date YYYY-MM-DD formatida to'g'ri sanani kiriting" }
  )
  to_date: string;
}
