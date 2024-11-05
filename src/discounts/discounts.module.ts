import { Module } from '@nestjs/common';
import { DiscountsService } from './discounts.service';
import { DiscountsController } from './discounts.controller';
import { Discount } from './models/discount.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { OwnerModule } from '../owner/owner.module';

@Module({
  imports: [SequelizeModule.forFeature([Discount]), JwtModule.register({}), OwnerModule],
  controllers: [DiscountsController],
  providers: [DiscountsService],
  exports: [DiscountsService, SequelizeModule], 
})
export class DiscountsModule {}
