import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @ApiProperty({
    example: "adminlogin1234",
    description: "admin logini orqali signin qilish",
  })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({
    example: "password123",
    description: "Parolni kiritish",
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
