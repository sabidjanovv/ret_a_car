import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer } from './models/customer.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { Booking } from '../booking/models/booking.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Customer]),
    JwtModule.register({}),
    MailModule,
    Booking
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports:[CustomerService, SequelizeModule]
})
export class CustomerModule {}
