import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPhoneNumber,
} from "class-validator";

export class CreateOfficeDto {
  @ApiProperty({
    description: "Name of the office",
    example: "Main Office",
  })
  @IsString()
  @IsNotEmpty({ message: "Office name is required" })
  name: string;

  @ApiProperty({
    description: "Address of the office",
    example: "1234 Elm St, Suite 567",
  })
  @IsString()
  @IsNotEmpty({ message: "Address is required" })
  address: string;

  @ApiProperty({
    description: 'Location coordinates in the format "latitude,longitude"',
    example: "41.40338, 2.17403",
  })
  @IsString()
  @IsNotEmpty({ message: "Location is required" })
  location: string;

  @ApiProperty({
    description: "Contact phone number of the office",
    example: "+1234567890",
  })
  @IsPhoneNumber(null, { message: "Phone number must be a valid format" })
  phone_number: string;

  @ApiProperty({
    description: "Description of the office",
    example: "Headquarters located downtown with a large conference room",
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "ID of the owner associated with the office",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: "Owner ID is required" })
  owner_id: number;
}
