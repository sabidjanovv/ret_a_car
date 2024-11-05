import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Office } from "../../office/models/office.model";
import { Booking } from "../../booking/models/booking.model";
import { Discount } from "../../discounts/models/discount.model";
import { Payment } from "../../payments/models/payment.model";

@Table({ tableName: "contract" })
export class Contract extends Model<Contract> {
  @ApiProperty({ example: 1, description: "Unikal identifikator" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: "Mijozning ID raqami" })
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  customer_id: number;
  @BelongsTo(() => Customer)
  customer: Customer;

  @ApiProperty({
    example: 1,
    description: "Idorada amalga oshirilgan ofis ID raqami",
  })
  @ForeignKey(() => Office)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  office_id: number;
  @BelongsTo(() => Office)
  office: Office;

  @ApiProperty({ example: 1, description: "Buyurtma ID raqami" })
  @ForeignKey(() => Booking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  booking_id: number;
  @BelongsTo(() => Booking)
  booking: Booking;

  @ApiProperty({ example: 1, description: "Chegirma ID raqami" })
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  discount_id: number;
  @BelongsTo(() => Discount)
  discount: Discount;

  @ApiProperty({ example: 500, description: "Umumiy narx" })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  total_price: number;

  @ApiProperty({ example: "1000 USD", description: "Garov summasi" })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pledge: string;

  @HasMany(()=>Payment)
  payments: Payment[];
}
