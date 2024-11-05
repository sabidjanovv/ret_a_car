import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Car } from "../../cars/models/car.model";
import { Contract } from "../../contract/models/contract.model";

@Table({ tableName: "booking" })
export class Booking extends Model<Booking> {
  @ApiProperty({ example: 1, description: "Booking ID (unique)" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: "Customer ID for the booking" })
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  customer_id: number;

  @BelongsTo(() => Customer)
  customer: Customer;

  @ApiProperty({ example: 1, description: "Car ID for the booking" })
  @ForeignKey(() => Car)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  car_id: number;

  @BelongsTo(() => Car)
  car: Car;

  @ApiProperty({ example: "2024-05-10", description: "Booking start date" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  start_date: string;

  @ApiProperty({ example: "2024-05-15", description: "Booking end date" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  end_date: string;

  @ApiProperty({ example: 500.0, description: "Total price of the booking" })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  total_price: number;

  @ApiProperty({
    example: "process",
    description: "Status of the booking",
    enum: ["procces", "cancelled", "completed"],
  })
  @Column({
    type: DataType.ENUM("procces", "cancelled", "completed"),
    allowNull: false,
  })
  status: "procces" | "cancelled" | "completed";

  @HasMany(()=>Contract)
  contracts: Contract[];
}