import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNumber, IsOptional, Matches } from "class-validator";

export class CreateCarDto {
  @ApiProperty({ example: "Toyota", description: "Car brand" })
  @IsString()
  brand: string;

  @ApiProperty({ example: "Camry", description: "Car model" })
  @IsString()
  model: string;

  @ApiProperty({ example: "2022", description: "Manufacturing year" })
  @IsString()
  year: string;

  @ApiProperty({ example: "01|A001AA", description: "Car number" })
  @IsString()
  @Matches(/^\d{2}\|[A-Z]\d{3}[A-Z]{2}$/, {
    message: 'Car number must be in the format "01|A001AA"',
  })
  car_number: string;

  @ApiProperty({
    example: "TEX123456",
    description: "Technical passport number",
  })
  @IsString()
  tex_passport: string;

  // @ApiProperty({ example: "bo'sh", description: "Car status" })
  // @IsEnum(["bo'sh", "ishlatilinmoqda", "band"])
  // status: "bo'sh" | "ishlatilinmoqda" | "band";

  @ApiProperty({ example: 500000, description: "Daily rental price" })
  @IsNumber()
  daily_price: number;

  @ApiProperty({ example: "White", description: "Car color" })
  @IsString()
  color: string;

  @ApiProperty({ example: "5", description: "Car capacity" })
  @IsString()
  capacity: string;

  @ApiProperty({ example: "benzin", description: "Fuel type" })
  @IsEnum(["benzin", "metan", "electric", "hybrid"])
  fuel_type: "benzin" | "metan" | "electric" | "hybrid";

  @ApiProperty({
    example: "A comfortable car for long trips.",
    description: "Car description",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: "Office ID" })
  @IsNumber()
  office_id: number;
}
