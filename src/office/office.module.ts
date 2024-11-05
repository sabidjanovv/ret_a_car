import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Office } from './models/office.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Office]), JwtModule.register({})],
  controllers: [OfficeController],
  providers: [OfficeService],
  exports: [OfficeService, SequelizeModule],
})
export class OfficeModule {}
