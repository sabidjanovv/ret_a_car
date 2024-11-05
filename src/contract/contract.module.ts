import { Module } from "@nestjs/common";
import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Contract } from "./models/contract.model";
import { BookingModule } from "../booking/booking.module";
import { OfficeModule } from "../office/office.module";
import { CustomerModule } from "../customer/customer.module";
import { DiscountsModule } from "../discounts/discounts.module";
import { CarsModule } from "../cars/cars.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    SequelizeModule.forFeature([Contract]),
    JwtModule.register({}),
    BookingModule,
    OfficeModule,
    CustomerModule,
    DiscountsModule,
    CarsModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService, SequelizeModule],
})
export class ContractModule {}
