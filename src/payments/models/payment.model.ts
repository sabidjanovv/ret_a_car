import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Contract } from "../../contract/models/contract.model";

@Table({ tableName: "payments" })
export class Payment extends Model<Payment> {
  @ApiProperty({ example: 1, description: "Unique Payment ID" })
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: "Contract ID associated with this payment",
  })
  @ForeignKey(() => Contract)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  contract_id: number;
  @BelongsTo(() => Contract)
  contract: Contract;

  @ApiProperty({
    example: 200.5,
    description: "Payment amount in currency units",
  })
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
      min: 0,
    },
  })
  amount: number;

  @ApiProperty({
    example: "2024-11-01",
    description: "Date when the payment was made",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isDate: true,
    },
  })
  payment_date: string;

  @ApiProperty({
    example: "credit_card",
    description: "Type of payment method",
    enum: ["credit_card", "cash"],
  })
  @Column({
    type: DataType.ENUM("credit_card", "cash"),
    allowNull: false,
  })
  payment_type: "credit_card" | "bank_transfer" | "cash" | "paypal";

  @ApiProperty({
    example: "completed",
    description: "Status of the payment",
    enum: ["pending", "completed", "failed"],
  })
  @Column({
    type: DataType.ENUM("pending", "completed", "failed"),
    allowNull: false,
  })
  payment_status: "pending" | "completed" | "failed";
}
