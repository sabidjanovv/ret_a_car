import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './models/car.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car) private carModel: typeof Car) {}

  async create(createCarDto: CreateCarDto) {
    return await this.carModel.create(createCarDto);
  }

  findAll() {
    return this.carModel.findAll({
      include: { all: true },
    });
  }

  findAllFreeCar() {
    return this.carModel.findAll({
      where: { status: 'free' },
      include: { all: true },
    });
  }

  async findOne(car_id: number) {
    const existingCar = await this.carModel.findByPk(car_id);
    if (!existingCar) {
      throw new NotFoundException(`Car with ID: ${car_id} does not exist.`);
    }
    const car = await this.carModel.findOne({
      where: { id: car_id },
      include: { all: true },
    });
    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carModel.update(updateCarDto, {
      where: { id },
      returning: true,
    });
    return car[1][0];
  }

  async remove(id: number) {
    const car = await this.carModel.findByPk(id);
    if (!car) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.carModel.destroy({ where: { id } });
    return { message: `ID: ${id} car has been deleted successfully` };
  }
}
