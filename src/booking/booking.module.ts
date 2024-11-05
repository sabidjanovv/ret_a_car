import { Module } from "@nestjs/common";
import { BookingService } from "./booking.service";
import { BookingController } from "./booking.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Booking } from "./models/booking.model";
import { CarsModule } from "../cars/cars.module";
import { JwtModule } from "@nestjs/jwt"; 

@Module({
  imports: [
    SequelizeModule.forFeature([Booking]),
    CarsModule,
    JwtModule.register({}),
  ],
  controllers: [BookingController],
  providers: [BookingService,],
  exports: [BookingService, SequelizeModule],
})
export class BookingModule {}
