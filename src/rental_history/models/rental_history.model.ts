import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Car } from "../../cars/models/car.model";

@Table({ tableName: "rental_history" })
export class RentalHistory extends Model<RentalHistory> {
  @ApiProperty({ example: 1, description: "Unique Rental History ID" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: 1, description: "ID of the rented car" })
  @ForeignKey(() => Car)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  car_id: number;
  @BelongsTo(() => Car)
  car: Car;

  @ApiProperty({
    example: 1,
    description: "ID of the customer who rented the car",
  })
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  customer_id: number;
  @BelongsTo(() => Customer)
  customer: Customer;

  @ApiProperty({
    example: "2024-05-10",
    description: "Start date of the rental period",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rental_start: string;

  @ApiProperty({
    example: "2024-05-15",
    description: "End date of the rental period",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rental_end: string;

  @ApiProperty({
    example: 500.0,
    description: "Total price of the rental",
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_price: number;
}