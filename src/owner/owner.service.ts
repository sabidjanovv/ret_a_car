import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Owner } from './models/owner.model';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { MailService } from '../mail/mail.service';
import { Response } from "express";


@Injectable()
export class OwnerService {
  constructor(
    @InjectModel(Owner) private ownerModel: typeof Owner,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  // async generateToken(owner: Owner) {
  //   const payload = {
  //     id: owner.id,
  //     login: owner.login,
  //     is_active: owner.is_active,
  //   };

  //   const [access_token, refresh_token] = await Promise.all([
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.ACCESS_TOKEN_KEY,
  //       expiresIn: process.env.ACCESS_TOKEN_TIME,
  //     }),
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //       expiresIn: process.env.REFRESH_TOKEN_TIME,
  //     }),
  //   ]);

  //   return { access_token, refresh_token };
  // }

  // async create(createOwnerDto: CreateOwnerDto, res: Response) {
  //   const owner = await this.ownerModel.findOne({
  //     where: { login: createOwnerDto.login },
  //   });

  //   if (owner) {
  //     throw new BadRequestException("Bunday owner mavjud");
  //   }

  //   if (createOwnerDto.password !== createOwnerDto.confirm_password) {
  //     throw new BadRequestException("Parollar mos emas");
  //   }

  //   const hashed_password = await bcrypt.hash(createOwnerDto.password, 7);
  //   const newOwner = await this.ownerModel.create({
  //     ...createOwnerDto,
  //     hashed_password,
  //   });
  //   const tokens = await this.generateToken(newOwner);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

  //   const updatedOwner = await this.ownerModel.update(
  //     { hashed_refresh_token },
  //     { where: { id: newOwner.id }, returning: true }
  //   );
  //   res.cookie("refresh_token", tokens.refresh_token, {
  //     httpOnly: true,
  //     maxAge: +process.env.REFRESH_TIME_MS,
  //   });

  //   return {
  //     // message: "owner muvaffaqiyatli ro'yxatdan o'tkazildi",
  //     owner: updatedOwner,
  //     access_token: tokens.access_token,
  //   };
  // }
  async activateOwner(link: string, res: Response) {
    try {
      const owner = await this.ownerModel.findOne({
        where: { activation_link: link },
      });
      if (!owner) {
        return res.status(400).send({ message: "Foydalanuvchi topilmadi!" });
      }

      if (owner.is_active) {
        return res
          .status(400)
          .send({ message: "Foydalanuvchi allaqachon faollashtirilgan." });
      }

      owner.is_active = true;
      await owner.save();

      res.send({
        is_active: owner.is_active,
        message: "Foydalanuvchi muvaffaqiyatli faollashtirildi.",
      });
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.ownerModel.findAll({ include: { all: true } });
  }

  findOne(id: number) {
    return this.ownerModel.findOne({ where: { id }, include: { all: true } });
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto) {
    try {
      const activation_link = uuid.v4();
      const [updatedCount, updatedOwners] = await this.ownerModel.update(
        { ...updateOwnerDto, is_active: false, activation_link },
        { where: { id }, returning: true }
      );

      if (updatedCount === 0) {
        throw new BadRequestException(
          `ID: ${id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      const updatedOwner = updatedOwners[0];

      try {
        await this.mailService.sendMail(updatedOwner);
      } catch (mailError) {
        console.error("Mail Sending Error:", mailError);
        throw new InternalServerErrorException("Xat yuborishda xatolik");
      }

      return {
        message: "Muvaffaqiyatli yangilandi, Faollashtirish uchun Emailga yuborilgan linkni ustiga bosing!",
      };
    } catch (error) {
      console.error("Update Error:", error);
      throw new InternalServerErrorException("Yangilashda xatolik yuz berdi.");
    }
  }

  async remove(id: number) {
    const owner = await this.ownerModel.findByPk(id);

    if (!owner) {
      return { message: `ID: ${id} mavjud emas` };
    }
    await this.ownerModel.destroy({ where: { id } });
    return { message: `ID: ${id} muvaffaqiyatli o'chirildi` };
  }
}
