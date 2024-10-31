import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
import { Owner } from '../owner/models/owner.model';
import { MailModule } from '../mail/mail.module';
@Module({
  imports: [
    SequelizeModule.forFeature([Admin, Owner]),
    JwtModule.register({}),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
