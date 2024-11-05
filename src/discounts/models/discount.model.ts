import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Contract } from "../../contract/models/contract.model";
// import { CustomerDiscount } from "../../customer/models/customer_discount_model";

export interface IDiscountAttr {
  id: number;
  discount_code: string;
  discount_percentage: number;
  from_date: string;
  to_date: string;
}


@Table({ tableName: "discounts" })
export class Discount extends Model<Discount, IDiscountAttr> {
  @ApiProperty({ example: "1", description: "Unikal identifikator" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  // Chegirma kodi
  @ApiProperty({
    description: "Yagona chegirma kodi",
    example: "SAVE20",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  discount_code: string;

  // Chegirma foiz qiymati
  @ApiProperty({
    description: "Chegirma foizi (1-100)",
    example: 20,
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  discount_percentage: number;

  // Chegirma boshlanish sanasi
  @ApiProperty({
    description:
      "Chegirma amal qilish boshlanish sanasi (YYYY-MM-DD formatida)",
    example: "2024-11-01",
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  from_date: string;

  // Chegirma tugash sanasi
  @ApiProperty({
    description: "Chegirma tugash sanasi (YYYY-MM-DD formatida)",
    example: "2024-11-30",
  })
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  to_date: string;

  // @BelongsToMany(() => Customer, () => CustomerDiscount)
  // customers: Customer[];

  @HasMany(() => Contract)
  contracts: Contract[];
}
