// import { ApiProperty } from "@nestjs/swagger";
// import { Column, DataType, Model, Table, ForeignKey } from "sequelize-typescript";
// import { Customer } from "./customer.model";
// import { Discount } from "../../discounts/models/discount.model";

// interface ICustomerDiscountAttr {
//   customer_id: number;
//   discount_id: number;
// }

// @Table({ tableName: "customer" })
// export class CustomerDiscount extends Model<
//   CustomerDiscount,
//   ICustomerDiscountAttr
// > {
//   @ApiProperty({ example: "1", description: "Unikal identifikator" })
//   @Column({
//     type: DataType.BIGINT,
//     primaryKey: true,
//     autoIncrement: true,
//   })
//   id: number;

//   @ApiProperty({ example: "1", description: "Unikal identifikator" })
//   @ForeignKey(() => Customer)
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: false,
//   })
//   customer_id: number;

//   @ApiProperty({ example: "1", description: "Unikal identifikator" })
//   @ForeignKey(() => Discount)
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: false,
//   })
//   discount_id: number;
// }