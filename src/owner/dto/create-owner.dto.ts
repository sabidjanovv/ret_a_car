import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateOwnerDto {
  @ApiProperty({
    description: "To'liq ism-familiyasi",
    example: "Olimov Shavkat",
  })
  @IsString({ message: "To'liq ism-familiya satr bo'lishi kerak" })
  @MinLength(3, {
    message: "To'liq ism-familiya kamida 3 ta belgidan iborat bo'lishi kerak",
  })
  full_name: string;

  @ApiProperty({
    description: "Login nomi",
    example: "shavkat123",
  })
  @IsString({ message: "Login satr bo'lishi kerak" })
  @MinLength(4, { message: "Login kamida 4 ta belgidan iborat bo'lishi kerak" })
  login: string;

  @ApiProperty({
    description: "Elektron pochta manzili",
    example: "shavkat@example.com",
  })
  @IsEmail({}, { message: "To'g'ri elektron pochta manzilini kiriting" })
  email: string;

  @ApiProperty({
    description: "Haydovchilik guvohnoma raqami",
    example: "A1234567",
  })
  @IsString({ message: "Guvohnoma raqami satr bo'lishi kerak" })
  @Matches(/^[A-Z0-9]{8}$/, {
    message:
      "Guvohnoma raqami to'g'ri formatda bo'lishi kerak (masalan: A1234567)",
  })
  licence_number: string;

  @ApiProperty({
    description: "Parol",
    example: "QattiqParol2023!",
  })
  @IsString({ message: "Parol satr bo'lishi kerak" })
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  password: string;

  @ApiProperty({
    description: "Parolni tasdiqlash",
    example: "QattiqParol2023!",
  })
  @IsString({ message: "Parolni tasdiqlash satr bo'lishi kerak" })
  @MinLength(8, {
    message: "Parolni tasdiqlash kamida 8 ta belgidan iborat bo'lishi kerak",
  })
  confirm_password: string;
}
