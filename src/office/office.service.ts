import { Injectable } from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Office } from './models/office.model';

@Injectable()
export class OfficeService {
  constructor (@InjectModel(Office) private officeModel: typeof Office){}
  create(createOfficeDto: CreateOfficeDto) {
    return this.officeModel.create(createOfficeDto);
  }

  findAll() {
    return this.officeModel.findAll({include:{all:true}});
  }

  async findOne(id: number) {
    const office = await this.officeModel.findByPk(id);

    if (!office) {
      return { message: `ID: ${id} office does not exist in the database` };
    }
    return this.officeModel.findByPk(id, {include:{all:true}});
  }

  async update(id: number, updateOfficeDto: UpdateOfficeDto) {
    const office = await this.officeModel.update(updateOfficeDto, {
      where: { id },
      returning: true,
    });
    return office[1][0];
  }

  async remove(id: number) {
    const office = await this.officeModel.findByPk(id);
    if (!office) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.officeModel.destroy({ where: { id } });
    return { message: `ID: ${id} office has been deleted successfully` };
  }
}
