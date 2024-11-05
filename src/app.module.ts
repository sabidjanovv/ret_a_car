import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from "@nestjs/serve-static";
import { SequelizeModule } from "@nestjs/sequelize";
import { join } from "node:path";
import { Admin } from './admin/models/admin.model';
import { OwnerModule } from './owner/owner.module';
import { Owner } from './owner/models/owner.model';
import { MailModule } from './mail/mail.module';
import { CustomerModule } from './customer/customer.module';
import { Customer } from './customer/models/customer.model';
import { OfficeModule } from './office/office.module';
import { Office } from './office/models/office.model';
import { CarsModule } from './cars/cars.module';
import { Car } from './cars/models/car.model';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/models/booking.model';
import { DiscountsModule } from './discounts/discounts.module';
import { Discount } from './discounts/models/discount.model';
// import { CustomerDiscount } from './customer/models/customer_discount_model';
import { ContractModule } from './contract/contract.module';
import { Contract } from './contract/models/contract.model';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/models/payment.model';
import { RentalHistoryModule } from './rental_history/rental_history.module';
import { RentalHistory } from './rental_history/models/rental_history.model';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/models/comment.model';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        Admin,
        Owner,
        Customer,
        Office,
        Car,
        Booking,
        Discount,
        // CustomerDiscount,
        Contract,
        Payment,
        RentalHistory,
        Comment
      ],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    AdminModule,
    AuthModule,
    OwnerModule,
    MailModule,
    CustomerModule,
    OfficeModule,
    CarsModule,
    BookingModule,
    DiscountsModule,
    ContractModule,
    PaymentsModule,
    RentalHistoryModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
