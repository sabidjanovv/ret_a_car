import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from "@nestjs/common";
import { OwnerService } from "./owner.service";
import { UpdateOwnerDto } from "./dto/update-owner.dto";
import { OwnerSelfGuard } from "../common/guards/owner-self.guard";
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { Response } from "express";
import { AdminGuard } from "../common/guards/admin.guard";

@ApiTags("Owner")
@Controller("owner")
export class OwnerController {
  constructor(private readonly ownerService: OwnerService) {}

  @ApiOperation({ summary: "Ownerni aktivlashtirish uchun link" })
  @ApiResponse({
    status: 200,
    description: "Owner muvaffaqiyatli aktivlashtirildi.",
  })
  @ApiResponse({ status: 404, description: "Aktivlashtirish linki topilmadi." })
  @Get("activate/:link")
  activateUser(@Param("link") link: string, @Res() res: Response) {
    return this.ownerService.activateOwner(link, res);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Barcha ownerlarni olish" })
  @ApiResponse({ status: 200, description: "Ownerlar ro'yxati." })
  @Get()
  findAll() {
    return this.ownerService.findAll();
  }

  @UseGuards(OwnerSelfGuard)
  @ApiOperation({ summary: "Ownerni ID orqali olish" })
  @ApiParam({
    name: "id",
    description: "Ownerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan owner ma'lumotlari." })
  @ApiResponse({ status: 404, description: "Owner topilmadi." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ownerService.findOne(+id);
  }

  @UseGuards(OwnerSelfGuard)
  @ApiOperation({ summary: "Owner ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Ownerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Owner muvaffaqiyatli yangilandi." })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: "Owner topilmadi." })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownerService.update(+id, updateOwnerDto);
  }

  @UseGuards(OwnerSelfGuard)
  @ApiOperation({ summary: "Ownerni o'chirish" })
  @ApiParam({
    name: "id",
    description: "Ownerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Owner muvaffaqiyatli o'chirildi." })
  @ApiResponse({ status: 404, description: "Owner topilmadi." })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ownerService.remove(+id);
  }
}
