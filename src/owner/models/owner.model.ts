import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Office } from "../../office/models/office.model";

interface IOwnerAttr {
  full_name: string;
  login: string;
  email: string;
  licence_number: string;
  is_active: boolean;
  hashed_password: string;
  hashed_refresh_token: string;
}

@Table({ tableName: "owner" })
export class Owner extends Model<Owner, IOwnerAttr> {
  @ApiProperty({ example: 1, description: "Unique identifier" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: "John Doe", description: "Owner's full name" })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  full_name: string;

  @ApiProperty({
    example: "john_doe",
    description: "Unique login for the owner",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  login: string;

  @ApiProperty({
    example: "john.doe@example.com",
    description: "Owner's email address",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: "LIC123456",
    description: "Unique licence number of the owner",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  licence_number: string;

  @ApiProperty({
    example: true,
    description: "Indicates if the owner is active",
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: "Indicates if the user is an owner",
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_owner: boolean;

  @ApiProperty({
    example: "$2b$10$abcdefghijklmnopqrstuv",
    description: "Hashed password",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @ApiProperty({
    example: "$2b$10$qrstuvwxyzabcdefghi",
    description: "Hashed refresh token",
  })
  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @ApiProperty({
    example: "a1b2c3d4-e5f6-7g8h-9i0j",
    description: "Activation link for the owner",
  })
  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @HasMany(() => Office)
  offices: Office[];
}
