import { Injectable } from "@nestjs/common";
import { Owner } from "../owner/models/owner.model";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(owner:Owner){
    const url = `${process.env.API_URL}:${process.env.PORT}/api/auth/activate/${owner.activation_link}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: owner.email,
      subject: "Stadium Finder appga xush kelibsiz",
      template: "./confirm",
      context: {
        full_name: owner.full_name,
        url,
      },
    });
  }
}
