import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCarDto } from "./dto/create-car.dto";
import { UpdateCarDto } from "./dto/update-car.dto";
import { Car } from "./models/car.model";
import { InjectModel } from "@nestjs/sequelize";
import { Booking } from "../booking/models/booking.model";

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car) private carModel: typeof Car,
    @InjectModel(Booking) private bookingModel: typeof Booking
  ) {}

  async create(createCarDto: CreateCarDto) {
    return await this.carModel.create(createCarDto);
  }

  findAll() {
    return this.carModel.findAll({
      include: { all: true },
    });
  }

  findAllFreeCar() {
    return this.carModel
      .findAll({
        where: { status: "free" },
        include: { all: true },
      })
      .then(async (cars) => {
        const today = new Date();
        for (const car of cars) {
          // Check for bookings for each car
          const bookings = await this.bookingModel.findAll({
            where: { car_id: car.id },
            include: { all: true },
          });

          // Update status to 'free' if booking's end_date is past today's date
          for (const booking of bookings) {
            const endDate = new Date(booking.end_date);
            if (endDate < today) {
              await this.carModel.update(
                { status: "free" },
                { where: { id: car.id } }
              );
              console.log(`Car with ID: ${car.id} status updated to 'free'`);
            }
          }
        }
        return cars;
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

    const bookings = await this.bookingModel.findAll({
      where: { car_id },
      include: { all: true },
    });

    if (bookings.length > 0) {
      // Get today's date
      const today = new Date();

      // Check if any booking's end_date is before today's date
      bookings.forEach(async (booking) => {
        const endDate = new Date(booking.end_date);
        if (endDate < today) {
          // Update car status to 'free' if the end_date is in the past
          await this.carModel.update(
            { status: "free" },
            { where: { id: car_id } }
          );
          console.log(`Car with ID: ${car_id} status updated to 'free'`);
        }
      });

      const maxBookingId = Math.max(...bookings.map((booking) => booking.id));
      console.log("Maximum booking ID:", maxBookingId);
    } else {
      console.log("No bookings found for this car.");
    }

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
