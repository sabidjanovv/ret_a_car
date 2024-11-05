import {
  Controller,
  Get,
  Res,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { Response } from "express";
import { CustomerSelfGuard } from "../common/guards/customer-self.guard";
import { AdminGuard } from "../common/guards/admin.guard";

@ApiTags("Customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: "Customerni aktivlashtirish uchun link" })
  @ApiResponse({
    status: 200,
    description: "Customer muvaffaqiyatli aktivlashtirildi.",
  })
  @ApiResponse({ status: 404, description: "Aktivlashtirish linki topilmadi." })
  @Get("activate/:link")
  activateUser(@Param("link") link: string, @Res() res: Response) {
    return this.customerService.activateCustomer(link, res);
  }

  @UseGuards(CustomerSelfGuard)
  @ApiOperation({ summary: "Barcha customerlarni olish" })
  @ApiResponse({ status: 200, description: "Customerlar ro'yxati." })
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @UseGuards(CustomerSelfGuard)
  @ApiOperation({ summary: "Customerni ID orqali olish" })
  @ApiParam({
    name: "id",
    description: "Customerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan customer ma'lumotlari." })
  @ApiResponse({ status: 404, description: "Customer topilmadi." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customerService.findOne(+id);
  }

  @UseGuards(CustomerSelfGuard)
  @ApiOperation({ summary: "Customer ma'lumotlarini yangilash" })
  @ApiParam({
    name: "id",
    description: "Customerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Customer muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: "Customer topilmadi." })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Customerni o'chirish" })
  @ApiParam({
    name: "id",
    description: "Customerning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Customer muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: "Customer topilmadi." })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customerService.remove(+id);
  }
}
