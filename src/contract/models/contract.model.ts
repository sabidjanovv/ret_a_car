import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Office } from "../../office/models/office.model";
import { Booking } from "../../booking/models/booking.model";
import { Discount } from "../../discounts/models/discount.model";

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

  @ApiProperty({ example: 1, description: "Buyurtma ID raqami" })
  @ForeignKey(() => Booking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  booking_id: number;

  @ApiProperty({ example: 1, description: "Chegirma ID raqami" })
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  discount_id: number;

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

  @BelongsTo(() => Customer)
  customer: Customer;

  @BelongsTo(() => Office)
  office: Office;

  @BelongsTo(() => Booking)
  booking: Booking;

  @BelongsTo(() => Discount)
  discount: Discount;
}
