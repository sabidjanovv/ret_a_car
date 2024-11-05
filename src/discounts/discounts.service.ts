import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateDiscountDto } from "./dto/create-discount.dto";
import { UpdateDiscountDto } from "./dto/update-discount.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Discount } from "./models/discount.model";
import { OwnerService } from "../owner/owner.service";

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount) private readonly discountModel: typeof Discount,
    private readonly ownerService: OwnerService
  ) {}

  async create(createDiscountDto: CreateDiscountDto, owner_id: number) {
    const { from_date, to_date } = createDiscountDto;

    const fromDate = new Date(from_date);
    const toDate = new Date(to_date);
    const timeDiff = toDate.getTime() - fromDate.getTime();

    if (timeDiff <= 0) {
      throw new BadRequestException(
        "Chegirma boshlanish sanasi tugash sanasidan avvalgi sana bo'lishi kerak"
      );
    }

    const owner = await this.ownerService.findOne(owner_id);
    if (!owner) {
      throw new BadRequestException("Avtomobil topilmadi");
    }

    const discount = new this.discountModel({
      ...createDiscountDto,
      from_date,
      to_date,
    });
    return discount.save();
  }

  async findAll() {
    return await this.discountModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const discount = await this.discountModel.findByPk(id);
    if (!discount) {
      throw new BadRequestException(`ID: ${id} discount mavjud emas!`);
    }
    return await this.discountModel.findOne({where:{id}, include:{all:true}});
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto) {
    const updatedDiscount = await this.discountModel.update(updateDiscountDto, {
      where: { id },
      returning: true,
    });
    return updatedDiscount;
  }

  async remove(id: number) {
    const discount = await this.discountModel.findByPk(id);
    if (!discount) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.discountModel.destroy({ where: { id } });
    return { message: `ID: ${id} discount has been deleted successfully` };
  }
}
