import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table, HasMany,BelongsToMany } from "sequelize-typescript";
import { Booking } from "../../booking/models/booking.model";
import { Discount } from "../../discounts/models/discount.model";
import { Contract } from "../../contract/models/contract.model";
import { RentalHistory } from "../../rental_history/models/rental_history.model";
import { Comment } from "../../comments/models/comment.model";
// import { CustomerDiscount } from "./customer_discount_model";

interface ICustomerAttr {
  full_name: string;
  login: string;
  phone_number: string;
  extra_phone_number: string;
  passport_number: string;
  email: string;
  hashed_password: string;
  license_number: string;
  is_active: boolean;
  hashed_refresh_token: string;
}

@Table({ tableName: "customer" })
export class Customer extends Model<Customer, ICustomerAttr> {
  @ApiProperty({ example: "1", description: "Unikal identifikator" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({ example: "Islom Karimov", description: "To'liq ism" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: "customer1",
    description: "Customer uchun unique login",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @ApiProperty({ example: "+998901234567", description: "Telefon raqam" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   is: /^\+998[0-9]{9}$/, // Check for Uzbekistan phone format
    // },
  })
  phone_number: string;

  @ApiProperty({
    example: "+998931234567",
    description: "Qo'shimcha telefon raqam",
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    // validate: {
    //   is: /^\+998[0-9]{9}$/,
    // },
    unique: true,
  })
  extra_phone_number: string;

  @ApiProperty({ example: "AA1234567", description: "Pasport ID raqami" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   is: /^[A-Z]{2}\d{7}$/,
    // },
  })
  passport_number: string;

  @ApiProperty({ example: "user@gmail.com", description: "Elektron pochta" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   isEmail: true,
    // },
  })
  email: string;

  @ApiProperty({ example: "hashedPassword123", description: "Hashed parol" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @ApiProperty({ example: "123456789", description: "Litsenziya raqami" })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    // validate: {
    //   is: /^[A-Z]{2}\d{7}$/,
    // },
  })
  license_number: string;

  @ApiProperty({ example: true, description: "Aktivlik holati" })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({ example: true, description: "Mijozligi haqida" })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_customer: boolean;

  @ApiProperty({
    example: "hashedRefreshToken123",
    description: "Hashed yangilash tokeni",
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @HasMany(() => Booking)
  bookings: Booking[];

  // @BelongsToMany(() => Discount, ()=> CustomerDiscount)
  // discounts: Discount[];

  @HasMany(() => Contract)
  contracts: Contract[];

  @HasMany(() =>RentalHistory)
  rental_histories: RentalHistory[];

  @HasMany(()=>Comment)
  comments: Comment[];
}
