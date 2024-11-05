import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: "ID of the customer providing the comment",
  })
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @ApiProperty({ example: 1, description: "ID of the car being commented on" })
  @IsNumber()
  @IsNotEmpty()
  car_id: number;

  @ApiProperty({
    example: "Great car, had a fantastic experience!",
    description: "Feedback from the customer",
  })
  @IsString()
//   @IsNotEmpty()
  feedback: string;
}
