import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { Response } from "express";
import { SignInDto } from './dto/admin-signin.dto';
import { Owner } from '../owner/models/owner.model';
import { CreateOwnerDto } from '../owner/dto/create-owner.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    @InjectModel(Owner) private ownerModel: typeof Owner,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  //===================== ADMIN ======================
  async generateToken(admin: Admin) {
    const payload = {
      id: admin.id,
      login: admin.login,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async refreshToken(id: number, refresh_token: string, res: Response) {
    try {
      const verified_token = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      if (!verified_token) {
        throw new UnauthorizedException("Unauthorized token");
      }
      if (id != verified_token.id) {
        throw new ForbiddenException("Forbidden admin");
      }
      const payload = { id: verified_token.id, login: verified_token.login };
      const token = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      });
      return {
        token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async adminSignUp(createAdminDto: CreateAdminDto, res: Response) {
    const admin = await this.adminModel.findOne({
      where: { login: createAdminDto.login },
    });

    if (admin) {
      throw new BadRequestException("Bunday admin mavjud");
    }

    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });
    const tokens = await this.generateToken(newAdmin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    const updatedAdmin = await this.adminModel.update(
      { hashed_refresh_token },
      { where: { id: newAdmin.id }, returning: true }
    );
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    return {
      message: "Admin muvaffaqiyatli ro'yxatdan o'tkazildi",
      admin: updatedAdmin,
      access_token: tokens.access_token,
    };
  }

  async adminSignIn(adminSignInDto: SignInDto, res: Response) {
    const { login, password } = adminSignInDto;
    const admin = await this.adminModel.findOne({
      where: { login },
    });

    if (!admin) {
      throw new UnauthorizedException("Admin topilmadi");
    }

    const validPassword = await bcrypt.compare(password, admin.hashed_password);
    if (!validPassword) {
      throw new UnauthorizedException("Noto'g'ri parol");
    }

    const tokens = await this.generateToken(admin);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    await this.adminModel.update(
      { is_active: true, hashed_refresh_token },
      { where: { id: admin.id } }
    );
    return res.json({
      message: "Tizimga muvaffaqiyatli kirildi",
      access_token: tokens.access_token,
    });
  }

  async adminSignOut(refreshToken: string, res: Response, id: number) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const admin = await this.adminModel.findOne({
        where: { id: payload.id },
      });
      if (!admin) {
        throw new UnauthorizedException("This admin not found");
      }

      if (id !== admin.id) {
        throw new BadRequestException("This another admin");
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        admin.hashed_refresh_token
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      res.clearCookie("refresh_token", {
        httpOnly: true,
      });

      await this.adminModel.update(
        { hashed_refresh_token: "" }, // Data to update
        { where: { id: payload.id } } // Options object with `where` clause
      );

      return { message: "Admin success signout", id: payload.id };
    } catch (error) {
      throw new BadRequestException("Internal server error");
    }
  }

  // ======================= OWNER ========================

  async generateTokenOwner(owner: Owner) {
    const payload = {
      id: owner.id,
      login: owner.login,
      is_active: owner.is_active,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async ownerSignUp(createOwnerDto: CreateOwnerDto, res: Response) {
    const owner = await this.ownerModel.findOne({
      where: { email: createOwnerDto.email },
    });

    if (owner) {
      throw new BadRequestException("Bunday owner mavjud");
    }

    if (createOwnerDto.password !== createOwnerDto.confirm_password) {
      throw new BadRequestException("Parollar mos emas");
    }

    const hashed_password = await bcrypt.hash(createOwnerDto.password, 7);
    const newOwner = await this.ownerModel.create({
      ...createOwnerDto,
      hashed_password,
    });
    const tokens = await this.generateTokenOwner(newOwner);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const activation_link = uuid.v4();
    const updatedOwner = await this.ownerModel.update(
      { hashed_refresh_token, activation_link },
      { where: { id: newOwner.id }, returning: true }
    );

    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    try {
      await this.mailService.sendMail(updatedOwner[1][0]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }

    const response = {
      message: "Owner tizimga muvaffaqiyatli qo'shildi",
      owner: updatedOwner[1][0],
      access_token: tokens.access_token,
    };

    return response;
  }

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

  async ownerSignIn(ownerSignInDto: SignInDto, res: Response) {
    const { login, password } = ownerSignInDto;
    const owner = await this.ownerModel.findOne({
      where: { login },
    });

    if (!owner) {
      throw new UnauthorizedException("owner topilmadi");
    }

    const validPassword = await bcrypt.compare(password, owner.hashed_password);
    if (!validPassword) {
      throw new UnauthorizedException("Noto'g'ri parol");
    }

    const tokens = await this.generateTokenOwner(owner);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    await this.ownerModel.update(
      { is_active: true, hashed_refresh_token },
      { where: { id: owner.id } }
    );
    return res.json({
      message: "Tizimga muvaffaqiyatli kirildi",
      access_token: tokens.access_token,
    });
  }

  async ownerSignOut(refreshToken: string, res: Response, id: number) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const owner = await this.ownerModel.findOne({
        where: { id: payload.id },
      });
      if (!owner) {
        throw new UnauthorizedException("This owner not found");
      }

      if (id !== owner.id) {
        throw new BadRequestException("This another owner");
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        owner.hashed_refresh_token
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      res.clearCookie("refresh_token", {
        httpOnly: true,
      });

      await this.ownerModel.update(
        { hashed_refresh_token: "" }, // Data to update
        { where: { id: payload.id } } // Options object with `where` clause
      );

      return { message: "Owner success signout", id: payload.id };
    } catch (error) {
      throw new BadRequestException("Internal server error");
    }
  }
}