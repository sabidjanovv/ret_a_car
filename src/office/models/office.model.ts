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
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPhoneNumber,
} from "class-validator";
import { Owner } from "../../owner/models/owner.model";
import { Car } from "../../cars/models/car.model";
import { Contract } from "../../contract/models/contract.model";

interface IOfficeAttr{
    name: string;
    address: string;
    location: string;
    phone_number: string;
    description: string;
    office_id: number;
}

@Table({ tableName: "offices" })
export class Office extends Model<Office, IOfficeAttr> {
  @ApiProperty({
    description: "Unique identifier for the office",
    example: 1,
  })
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    description: "Name of the office",
    example: "Main Office",
  })
  @IsString()
  @IsNotEmpty({ message: "Office name is required" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    description: "Address of the office",
    example: "1234 Elm St, Suite 567",
  })
  @IsString()
  @IsNotEmpty({ message: "Address is required" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @ApiProperty({
    description: 'Location coordinates in the format "latitude,longitude"',
    example: "41.40338, 2.17403",
  })
  @IsString()
  @IsNotEmpty({ message: "Location is required" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @ApiProperty({
    description: "Contact phone number of the office",
    example: "+1234567890",
  })
  @IsPhoneNumber(null, { message: "Phone number must be a valid format" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true, // Ensures phone numbers are unique across offices
  })
  phone_number: string;

  @ApiProperty({
    description: "Description of the office",
    example: "Headquarters located downtown with a large conference room",
  })
  @IsString()
  @IsOptional()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ApiProperty({
    description: "ID of the owner associated with the office",
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty({ message: "Owner ID is required" })
  @ForeignKey(() => Owner)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  owner_id: number;
  @BelongsTo(() => Owner)
  owner: Owner;

  @HasMany(() => Car)
  cars: Car[];

  @HasMany(() => Contract)
  contracts: Contract[];
}
