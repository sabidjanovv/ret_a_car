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
import { DiscountsService } from "./discounts.service";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { OwnerSelfGuard } from "../common/guards/owner-self.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("Discounts")
@Controller("discounts")
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @UseGuards(OwnerSelfGuard)
  @ApiOperation({ summary: "Yangi discount yaratish" })
  @ApiParam({
    name: "id",
    description: "Discountning egasi uchun unikal ID",
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description: "Discount muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post(":id")
  create(
    @Body() createDiscountDto: CreateDiscountDto,
    @Param("id") owner_id: number
  ) {
    return this.discountsService.create(createDiscountDto, owner_id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Barcha discountlarni olish" })
  @ApiResponse({ status: 200, description: "Discountlar ro'yxati." })
  @Get()
  findAll() {
    return this.discountsService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Discountni ID orqali olish" })
  @ApiParam({
    name: "id",
    description: "Discountning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan discount ma'lumotlari." })
  @ApiResponse({ status: 404, description: "Discount topilmadi." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.discountsService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Discount ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Discountning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Discount muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: "Discount topilmadi." })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDiscountDto: UpdateDiscountDto
  ) {
    return this.discountsService.update(+id, updateDiscountDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Discountni o'chirish" })
  @ApiParam({
    name: "id",
    description: "Discountning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Discount muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: "Discount topilmadi." })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.discountsService.remove(+id);
  }
}
