import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { Contract } from "./models/contract.model";
import { InjectModel } from "@nestjs/sequelize";
import { Booking } from "../booking/models/booking.model";
import { BookingService } from "../booking/booking.service";
import { Office } from "../office/models/office.model";
import { Customer } from "../customer/models/customer.model";
import { Discount } from "../discounts/models/discount.model";
import { DiscountsService } from "../discounts/discounts.service";
import { CustomerService } from "../customer/customer.service";
import { OfficeService } from "../office/office.service";
import { Car } from "../cars/models/car.model";
import { CarsService } from "../cars/cars.service";

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract) private readonly contractModel: typeof Contract,
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    @InjectModel(Office) private readonly officeModel: typeof Office,
    @InjectModel(Customer) private readonly customerModel: typeof Customer,
    @InjectModel(Discount) private readonly discountModel: typeof Discount,
    @InjectModel(Car) private readonly carModel: typeof Car,
    private readonly bookingService: BookingService,
    private readonly officeService: OfficeService,
    private readonly customerService: CustomerService,
    private readonly discountService: DiscountsService,
    private readonly carService: CarsService
  ) {}
  async create(createContractDto: CreateContractDto) {
    const booking = await this.bookingService.findOne(
      createContractDto.booking_id
    );
    if (!booking) {
      throw new NotFoundException(
        `ID: ${createContractDto.booking_id} booking mavjud emas!`
      );
    }

    if (booking.status === "completed") {
      throw new BadRequestException("Avtomobil ijarada yoki bro'n qilingan!");
    }

    const office = await this.officeService.findOne(
      createContractDto.office_id
    );
    if (!office) {
      throw new NotFoundException(
        `ID: ${createContractDto.office_id} office mavjud emas!`
      );
    }

    const customer = await this.customerService.findOne(
      createContractDto.customer_id
    );
    if (!customer) {
      throw new NotFoundException(
        `ID: ${createContractDto.customer_id} customer mavjud emas!`
      );
    }

    // Discount bor yoki yo'qligini tekshirish
    let totalPrice = booking.total_price;
    if (createContractDto.discount_id) {
      const discount = await this.discountService.findOne(
        createContractDto.discount_id
      );
      if (!discount || new Date(discount.to_date) < new Date()) {
        throw new BadRequestException(
          "Chegirma mavjud emas yoki muddati tugagan!"
        );
      }

      const discountAmount = (totalPrice / 100) * discount.discount_percentage;
      totalPrice -= discountAmount;
    }

    const contract = await this.contractModel.create({
      customer_id: createContractDto.customer_id,
      office_id: createContractDto.office_id,
      booking_id: createContractDto.booking_id,
      discount_id: createContractDto.discount_id || null, // discount_id optional qilingan
      total_price: totalPrice,
      pledge: createContractDto.pledge,
    });

    // Booking va Car statuslarini yangilash
    booking.status = "procces";
    await booking.save();

    const car = await this.carService.findOne(booking.car_id);
    car.status = "booked";
    await car.save();

    return contract;
  }

  async findAll() {
    return this.contractModel.findAll({ include: { all: true } });
  }

  async findOne(id: number) {
    const contract = await this.contractModel.findByPk(id);
    if (!contract) {
      throw new NotFoundException(`ID: ${id} contract mavjud emas!`);
    }
    return await this.contractModel.findOne({
      where: { id: id },
      include: { all: true },
    });
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    const contract = await this.contractModel.findByPk(id);
    if (!contract) {
      throw new NotFoundException(`ID: ${id} contract mavjud emas!`);
    }

    const updatedContract = await this.contractModel.update(updateContractDto, {
      where: { id: id },
    });
    return updatedContract;
  }

  async remove(id: number) {
    const contract = await this.contractModel.findByPk(id);
    if (!contract) {
      throw new NotFoundException(`ID: ${id} contract mavjud emas!`);
    }
    await contract.destroy();
    return contract;
  }
}
