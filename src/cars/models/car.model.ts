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
import { Office } from "../../office/models/office.model";
import { Booking } from "../../booking/models/booking.model";
import { RentalHistory } from "../../rental_history/models/rental_history.model";
import { Comment } from "../../comments/models/comment.model";

export interface ICarAttr {
  id?: number; // Optional, as it will be auto-incremented
  brand: string;
  model: string;
  year: string;
  car_number: string;
  tex_passport: string;
  status: "booked" | "busy" | "free";
  daily_price: number;
  color: string;
  capacity: string;
  fuel_type: "benzin" | "metan" | "electric" | "hybrid";
  description?: string;
  office_id: number;
}


@Table({ tableName: "cars" })
export class Car extends Model<Car, ICarAttr> {
  @ApiProperty({ example: "1", description: "Unique identifier" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: "Toyota", description: "Car brand" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  brand: string;

  @ApiProperty({ example: "Camry", description: "Car model" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  model: string;

  @ApiProperty({ example: "2022", description: "Manufacturing year" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  year: string;

  @ApiProperty({ example: "AA1234BB", description: "Car number" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  car_number: string;

  @ApiProperty({
    example: "TEX123456",
    description: "Technical passport number",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tex_passport: string;

  @ApiProperty({ example: "booked", description: "Car status" })
  @Column({
    type: DataType.ENUM("booked", "busy", "free"),
    defaultValue: "free"
  })
  status: "booked" | "busy" | "free";

  @ApiProperty({ example: 500000, description: "Daily rental price" })
  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  daily_price: number;

  @ApiProperty({ example: "White", description: "Car color" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: string;

  @ApiProperty({ example: "5", description: "Car capacity" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  capacity: string;

  @ApiProperty({ example: "benzin", description: "Fuel type" })
  @Column({
    type: DataType.ENUM("benzin", "metan", "electric", "hybrid"),
    allowNull: false,
  })
  fuel_type: "benzin" | "metan" | "electric" | "hybrid";

  @ApiProperty({
    example: "A comfortable car for long trips.",
    description: "Car description",
  })
  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ApiProperty({ example: 1, description: "Office ID" })
  @ForeignKey(() => Office)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  office_id: number;
  @BelongsTo(() => Office)
  office: Office;

  @HasMany(() => Booking)
  bookings: Booking[];

  @HasMany(() => RentalHistory)
  rental_histories: RentalHistory[];

  @HasMany(()=>Comment)
  comments: Comment[];
}
