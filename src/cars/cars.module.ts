import { Module } from "@nestjs/common";
import { CarsService } from "./cars.service";
import { CarsController } from "./cars.controller";
import { JwtModule } from "@nestjs/jwt";
import { Car } from "./models/car.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { OfficeModule } from "../office/office.module"; // OfficeModule ni import qiling

@Module({
  imports: [
    SequelizeModule.forFeature([Car]),
    JwtModule.register({}),
    OfficeModule, // OfficeModule ni imports ga qo'shing
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService, SequelizeModule],
})
export class CarsModule {}
