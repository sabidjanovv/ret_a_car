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
import { ContractService } from "./contract.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { CustomerContractGuard } from "../common/guards/customer-contract.guard";
import { CustomerContractGetGuard } from "../common/guards/customer-contract-self.guard";
import { AdminGuard } from "../common/guards/admin.guard";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("Contracts")
@Controller("contract")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @UseGuards(CustomerContractGuard)
  @ApiOperation({ summary: "Yangi contract yaratish" })
  @ApiResponse({
    status: 201,
    description: "Contract muvaffaqiyatli yaratildi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Barcha contractlarni olish" })
  @ApiResponse({ status: 200, description: "Contractlar ro'yxati." })
  @Get()
  findAll() {
    return this.contractService.findAll();
  }

  @UseGuards(CustomerContractGetGuard)
  @ApiOperation({ summary: "Contractni ID orqali olish" })
  @ApiParam({
    name: "id",
    description: "Contractning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan contract ma'lumotlari." })
  @ApiResponse({ status: 404, description: "Contract topilmadi." })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.contractService.findOne(+id);
  }

  @UseGuards(CustomerContractGetGuard)
  @ApiOperation({ summary: "Contractni yangilash" })
  @ApiParam({
    name: "id",
    description: "Contractning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Contract muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: "Contract topilmadi." })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateContractDto: UpdateContractDto
  ) {
    return this.contractService.update(+id, updateContractDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Contractni o'chirish" })
  @ApiParam({
    name: "id",
    description: "Contractning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Contract muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: "Contract topilmadi." })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contractService.remove(+id);
  }
}
