import { Injectable } from "@nestjs/common";
import { Owner } from "../owner/models/owner.model";
import { MailerService } from "@nestjs-modules/mailer";
import { Customer } from "../customer/models/customer.model";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(owner:Owner){
    const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate/${owner.activation_link}`;
    await this.mailerService.sendMail({
      to: owner.email,
      subject: "Rent a Car'ga xush kelibsiz",
      template: "./confirm",
      context: {
        full_name: owner.full_name,
        url,
      },
    });
  }

  async sendMailCustomer(customer:Customer){
    const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate-customer/${customer.activation_link}`;
    await this.mailerService.sendMail({
      to: customer.email,
      subject: "Rent a Car'ga xush kelibsiz",
      template: "./confirm",
      context: {
        full_name: customer.full_name,
        url,
      },
    });
  }
}
