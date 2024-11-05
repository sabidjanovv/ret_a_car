import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './models/booking.model';
import { CarsService } from '../cars/cars.service';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from '../cars/models/car.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    private readonly carsService: CarsService,
    @InjectModel(Car) private readonly carModel: Car
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { car_id, start_date, end_date } = createBookingDto;

    // start_date va end_date o'rtasidagi farqni olish
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();

    if (timeDiff <= 0) {
      throw new BadRequestException(
        "Ijaraning tugash sanasi boshlanish sanasidan keyin bo'lishi kerak"
      );
    }

    const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // kunlarni hisoblash

    // Avtomobilning kunlik ijarasi narxini olish
    const car = await this.carsService.findOne(car_id);
    if (!car) {
      throw new BadRequestException("Avtomobil topilmadi");
    }

    if (
      car.status === "busy" ||
      car.status === "booked"
    ) {
      throw new BadRequestException(
        "Avtomobil allaqachon band qilingan yoki ijarada yoki yakunlangan!"
      );
    }

    const totalPrice = rentalDays * car.daily_price;

    await this.carModel.update({ status: "booked" }, { where: { id: car_id } });

    const booking = new this.bookingModel({
      ...createBookingDto,
      start_date: createBookingDto.start_date,
      end_date: createBookingDto.end_date,
      total_price: totalPrice,
      status: "procces"
    });

    return booking.save();
  }

  findAll() {
    return this.bookingModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const booking = await this.bookingModel.findOne({
      where: { id },
      include: { all: true },
    });
    if (!booking) {
      throw new BadRequestException(`ID: ${id} booking mavjud emas!`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const { car_id, start_date, end_date } = updateBookingDto;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();

    if (timeDiff <= 0) {
      throw new BadRequestException(
        "Ijaraning tugash sanasi boshlanish sanasidan keyin bo'lishi kerak"
      );
    }

    const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // kunlarni hisoblash

    // Avtomobilning kunlik ijarasi narxini olish
    const car = await this.carsService.findOne(car_id);
    if (!car) {
      throw new BadRequestException("Avtomobil topilmadi");
    }

    if (car.status === "busy") {
      throw new BadRequestException("Avtomobil ijarada");
    }

    if (car.status === "booked") {
      throw new BadRequestException("Avtomobil allaqachon band qilingan!");
    }

    const totalPrice = rentalDays * car.daily_price;

    const booking = new this.bookingModel({
      ...updateBookingDto,
      start_date: updateBookingDto.start_date,
      end_date: updateBookingDto.end_date,
      total_price: totalPrice,
    });

    return booking.save();
  }

  async cancel(id: number) {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) {
      throw new BadRequestException(`ID: ${id} booking mavjud emas!`);
    }

    await this.carModel.update({ status: "free" }, { where: { id: booking.car_id } });
    booking.status = "cancelled";

    return booking.save();
  }

  async remove(id: number) {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.bookingModel.destroy({ where: { id } });
    return { message: `ID: ${id} booking has been deleted successfully` };
  }
}
