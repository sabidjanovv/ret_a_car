import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { OwnerSelfGuard } from '../guards/owner-self.guard';
import { AdminCreatorGuard } from '../guards/admin_creator.guard';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from "express";

@Controller("owner")
export class OwnerController {
  constructor(private readonly ownerService: OwnerService,
  ) {}

  @ApiOperation({ summary: "Ownerni aktivlashtirish uchun link" })
  @Get("activate/:link")
  activateUser(@Param("link") link: string, @Res() res: Response) {
    return this.ownerService.activateOwner(link, res);
  }

  @UseGuards(AdminCreatorGuard)
  @Get()
  findAll() {
    return this.ownerService.findAll();
  }

  @UseGuards(OwnerSelfGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ownerService.findOne(+id);
  }

  @UseGuards(OwnerSelfGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownerService.update(+id, updateOwnerDto);
  }

  @UseGuards(OwnerSelfGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ownerService.remove(+id);
  }
}
