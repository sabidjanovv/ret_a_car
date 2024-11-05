import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsEnum,
} from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({
    example: 1,
    description: "Contract ID associated with this payment",
  })
  @IsNotEmpty({ message: "Contract ID bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Contract ID raqam bo'lishi kerak" })
  contract_id: number;

  @ApiProperty({
    example: 100000,
    description: "Amount of the payment",
  })
  @IsNotEmpty({ message: "Payment amount bo'sh bo'lmasligi kerak" })
  @IsNumber({}, { message: "Payment amount raqam bo'lishi kerak" })
  payment_amount: number;

  @ApiProperty({
    example: "2024-11-01",
    description: "Date when the payment was made",
  })
  @IsNotEmpty({ message: "Payment date bo'sh bo'lmasligi kerak" })
  @IsDateString(
    {},
    {
      message:
        "Payment date to'g'ri sana formatida bo'lishi kerak (YYYY-MM-DD)",
    }
  )
  payment_date: string;

  @ApiProperty({
    example: "credit_card",
    description: "Type of payment method",
    enum: ["credit_card", "cash"],
  })
  @IsNotEmpty({ message: "Payment type bo'sh bo'lmasligi kerak" })
  @IsEnum(["credit_card", "cash"], {
    message: "Payment type noto'g'ri qiymatga ega",
  })
  payment_type: "credit_card" | "cash";

//   @ApiProperty({
//     example: "completed",
//     description: "Status of the payment",
//     enum: ["pending", "completed", "failed"],
//   })
//   @IsNotEmpty({ message: "Payment status bo'sh bo'lmasligi kerak" })
//   @IsEnum(["pending", "completed", "failed"], {
//     message: "Payment status noto'g'ri qiymatga ega",
//   })
//   payment_status: "pending" | "completed" | "failed";
}
