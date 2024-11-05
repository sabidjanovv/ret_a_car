import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Payment } from "./models/payment.model";
import { ContractService } from "../contract/contract.service";
import { BookingService } from "../booking/booking.service";
import { RentalHistoryService } from "../rental_history/rental_history.service";
import { CarsService } from "../cars/cars.service";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private readonly paymentModel: typeof Payment,
    private readonly contractService: ContractService,
    private readonly bookingService: BookingService,
    private readonly rentalHistoryService: RentalHistoryService,
    private readonly carsService: CarsService
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { contract_id, payment_amount, payment_date, payment_type } =
      createPaymentDto;

    // Contractni tekshirish
    const contract = await this.contractService.findOne(contract_id);
    if (!contract) {
      throw new NotFoundException(
        `Contract with ID: ${contract_id} not found!`
      );
    }

    // Booking va car holatini yangilash
    const booking = await this.bookingService.findOne(contract.booking_id);
    const car = await this.carsService.findOne(booking.car_id);

    if (booking.status === "completed") {
      throw new NotFoundException(
        `Booking with ID: ${booking.id} already completed!`
      );
    } else {
      booking.status = "completed";
      car.status = "busy";
      await booking.save();
      await car.save();
    }

    // Payment miqdorini tekshirish
    if (Number(contract.total_price) !== Number(payment_amount)) {
      throw new NotFoundException(
        "Payment amount does not match contract total price!"
      );
    }

    // Rental history yaratish
    await this.rentalHistoryService.create({
      car_id: booking.car_id,
      customer_id: contract.customer_id,
      rental_start: booking.start_date,
      rental_end: booking.end_date,
      total_price: contract.total_price,
    });

    // Payment yaratish
    const payment = await this.paymentModel.create({
      contract_id,
      amount: contract.total_price,
      payment_date,
      payment_type,
      payment_status: "completed",
    });

    return payment;
  }

  async findAll() {
    return await this.paymentModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const payment = await this.paymentModel.findByPk(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID: ${id} not found!`);
    }

    return await this.paymentModel.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const [affectedCount, [updatedPayment]] = await this.paymentModel.update(
      updatePaymentDto,
      {
        where: { id },
        returning: true,
      }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Payment with ID: ${id} not found!`);
    }

    return updatedPayment;
  }

  async remove(id: number) {
    const payment = await this.paymentModel.findByPk(id);
    if (!payment) {
      return { message: `ID: ${id} does not exist in the database` };
    }

    await this.paymentModel.destroy({ where: { id } });
    return { message: `ID: ${id} payment has been deleted successfully` };
  }
}
