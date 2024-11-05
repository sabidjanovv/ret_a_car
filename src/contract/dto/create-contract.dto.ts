import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDecimal,
} from "class-validator";

export class CreateContractDto {
  @ApiProperty({ example: 1, description: "Mijozning ID raqami" })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({ example: 1, description: "Ofis ID raqami" })
  @IsNotEmpty()
  @IsNumber()
  office_id: number;

  @ApiProperty({ example: 1, description: "Buyurtma ID raqami" })
  @IsNotEmpty()
  @IsNumber()
  booking_id: number;

  @ApiProperty({ example: 1, description: "Chegirma ID raqami" })
  @IsOptional()
  @IsNumber()
  discount_id?: number;

  // @ApiProperty({ example: 500, description: "Umumiy narx" })
  // @IsNotEmpty()
  // @IsDecimal()
  // total_price: number;

  @ApiProperty({ example: "1000 USD", description: "Garov summasi" })
  @IsOptional()
  @IsString()
  pledge?: string;
}
