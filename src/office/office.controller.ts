import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { OfficeService } from "./office.service";
import { CreateOfficeDto } from "./dto/create-office.dto";
import { UpdateOfficeDto } from "./dto/update-office.dto";
import { Office } from "./models/office.model";
import { OwnerOfficeGuard } from "../common/guards/owner-office.guard";
import { OwnerOfficeCreateGuard } from "../common/guards/owner-office.create.guard";
import { AdminGuard } from "../common/guards/admin.guard";

@ApiTags("Office") // Swagger'da 'Office' deb nomlangan tag ostida barcha endpointlar ko'rsatiladi
@Controller("office")
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @UseGuards(OwnerOfficeCreateGuard)
  @Post()
  @ApiOperation({ summary: "Yangi ofis qo'shish" })
  @ApiResponse({
    status: 201,
    description: "Ofis muvaffaqiyatli qo'shildi.",
    type: Office,
  })
  @ApiResponse({ status: 400, description: "Xato so'rov." })
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: "Barcha ofislarni olish" })
  @ApiResponse({
    status: 200,
    description: "Barcha ofislar ro'yxati muvaffaqiyatli olindi.",
    type: [Office],
  })
  findAll() {
    return this.officeService.findAll();
  }

  @UseGuards(OwnerOfficeGuard)
  @Get(":id")
  @ApiOperation({ summary: "ID bo'yicha bitta ofisni olish" })
  @ApiResponse({
    status: 200,
    description: "Ofis ma'lumotlari muvaffaqiyatli olindi.",
    type: Office,
  })
  @ApiResponse({ status: 404, description: "Ofis topilmadi." })
  findOne(@Param("id") id: string) {
    return this.officeService.findOne(+id);
  }

  @UseGuards(OwnerOfficeCreateGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Ofis ma'lumotlarini yangilash" })
  @ApiResponse({
    status: 200,
    description: "Ofis ma'lumotlari muvaffaqiyatli yangilandi.",
    type: Office,
  })
  @ApiResponse({ status: 400, description: "Xato so'rov." })
  @ApiResponse({ status: 404, description: "Ofis topilmadi." })
  update(@Param("id") id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(+id, updateOfficeDto);
  }

  @UseGuards(OwnerOfficeGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Ofisni o'chirish" })
  @ApiResponse({
    status: 200,
    description: "Ofis muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: "Ofis topilmadi." })
  remove(@Param("id") id: string) {
    return this.officeService.remove(+id);
  }
}
