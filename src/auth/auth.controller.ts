import { Controller, Post, Body, Res, Param, HttpStatus, Req, UseGuards, Get } from "@nestjs/common";
import { AuthService } from './auth.service';
import { Admin } from '../admin/models/admin.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { AdminService } from '../admin/admin.service';
import { Response, Request } from "express";
import { SignInDto } from './dto/admin-signin.dto';
import { CookieGetter } from '../decorators/cookieGetter.decorator';
import { JwtAdminAuthGuard } from "../guards/jwt-admin_auth.guard";
import { AdminCreatorGuard } from "../guards/admin_creator.guard";
import { CreateOwnerDto } from "../owner/dto/create-owner.dto";
import { Owner } from "../owner/models/owner.model";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AdminCreatorGuard)
  @Post("admin-signup")
  @ApiOperation({ summary: "Yangi admin qo'shish (is_creator yarata oladi)" })
  @ApiResponse({
    status: 201,
    description: "Create Admin",
    type: Admin,
  })
  async adminSignUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response
  ) {
    const result = await this.authService.adminSignUp(createAdminDto, res);
    return res.status(201).json(result);
  }

  @Post("admin-signin")
  @ApiOperation({ summary: "Admin tizimga kirish" })
  @ApiResponse({
    status: 200,
    description: "Admin signin",
    type: Admin,
  })
  async adminSignIn(@Body() adminSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.adminSignIn(adminSignInDto, res);
  }

  @ApiOperation({ summary: "ma'lumotlarni tokenga o'zgartirish" })
  @Post("/refreshToken/:id")
  async refreshToken(
    @Param("id") id: number,
    @CookieGetter("refresh_token") refresh_token: string,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.refreshToken(id, refresh_token, res);
  }

  @Post("admin-signout/:id")
  @ApiOperation({ summary: "Admin tizimdan chiqishi" })
  @ApiResponse({
    status: 200,
    description: "Admin signout",
  })
  async adminSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string // Correct usage of decorator
  ) {
    const refreshToken = req.cookies["refresh_token"];

    return this.authService.adminSignOut(refreshToken, res, +id);
  }

  //==================== OWNER ===========================

  @Post("owner-signup")
  @ApiOperation({ summary: "Yangi owner qo'shish" })
  @ApiResponse({
    status: 201,
    description: "Create Owner",
    type: Owner,
  })
  async ownerSignUp(
    @Body() createOwnerDto: CreateOwnerDto,
    @Res() res: Response
  ) {
    const result = await this.authService.ownerSignUp(createOwnerDto, res);
    return res.status(201).json(result);
  }

  @ApiOperation({ summary: "Userni aktivlashtirish uchun link" })
  @Get("activate/:link")
  activateUser(@Param("link") link: string, @Res() res: Response) {
    return this.authService.activateOwner(link, res);
  }

  @Post("owner-signin")
  @ApiOperation({ summary: "Owner tizimga kirish" })
  @ApiResponse({
    status: 200,
    description: "Owner signin",
    type: Owner,
  })
  async ownerSignIn(@Body() ownerSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.ownerSignIn(ownerSignInDto, res);
  }

  @Post("owner-signout/:id")
  @ApiOperation({ summary: "Owner tizimdan chiqishi" })
  @ApiResponse({
    status: 200,
    description: "Owner signout",
  })
  async ownerSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param("id") id: string // Correct usage of decorator
  ) {
    const refreshToken = req.cookies["refresh_token"];

    return this.authService.ownerSignOut(refreshToken, res, +id);
  }
}
