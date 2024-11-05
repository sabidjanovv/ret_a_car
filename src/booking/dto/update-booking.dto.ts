import { PartialType } from "@nestjs/swagger";
import { CreateBookingDto } from "./create-booking.dto";
import { IsOptional, IsString } from "class-validator";

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}