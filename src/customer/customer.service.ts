import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { MailService } from '../mail/mail.service';
import * as uuid from "uuid";
import { Response } from "express";

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer) private customerModel: typeof Customer,
    // private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async activateCustomer(link: string, res: Response) {
    try {
      const customer = await this.customerModel.findOne({
        where: { activation_link: link },
      });
      if (!customer) {
        return res.status(400).send({ message: "Foydalanuvchi topilmadi!" });
      }

      if (customer.is_active) {
        return res
          .status(400)
          .send({ message: "Foydalanuvchi allaqachon faollashtirilgan." });
      }

      customer.is_active = true;
      await customer.save();

      res.send({
        is_active: customer.is_active,
        message: "Foydalanuvchi muvaffaqiyatli faollashtirildi.",
      });
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.customerModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      throw new BadRequestException(`ID: ${id} foydalanuvchi topilmadi!`);
    }
    return this.customerModel.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const activation_link = uuid.v4();
      const [updatedCount, updatedCustomers] = await this.customerModel.update(
        { ...updateCustomerDto, is_active: false, activation_link },
        { where: { id }, returning: true }
      );

      if (updatedCount === 0) {
        throw new BadRequestException(
          `ID: ${id} bo'lgan foydalanuvchi topilmadi.`
        );
      }

      const updatedCustomer = updatedCustomers[0];

      try {
        await this.mailService.sendMailCustomer(updatedCustomer);
      } catch (mailError) {
        console.error("Mail Sending Error:", mailError);
        throw new InternalServerErrorException("Xat yuborishda xatolik");
      }

      return {
        message:
          "Muvaffaqiyatli yangilandi, Faollashtirish uchun Emailga yuborilgan linkni ustiga bosing!",
      };
    } catch (error) {
      console.error("Update Error:", error);
      throw new InternalServerErrorException("Yangilashda xatolik yuz berdi.");
    }
  }

  async remove(id: number) {
    const customer = await this.customerModel.findByPk(id);
    if (!customer) {
      return { message: `ID: ${id} does not exist in the database` };
    }

    await this.customerModel.destroy({ where: { id } });
    return { message: `ID: ${id} foydalanuvchi o'chirildi` };
  }
}
