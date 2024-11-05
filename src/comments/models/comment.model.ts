import { Column, DataType, Model, Table, ForeignKey } from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "../../customer/models/customer.model";
import { Car } from "../../cars/models/car.model";

@Table({ tableName: "comments" })
export class Comment extends Model<Comment> {
  @ApiProperty({ example: 1, description: "Unique identifier for the comment" })
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 1,
    description: "ID of the customer who provided the comment",
  })
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  customer_id: number;

  @ApiProperty({ example: 1, description: "ID of the car being commented on" })
  @ForeignKey(() => Car)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  car_id: number;

  @ApiProperty({
    example: "Great car, had a fantastic experience!",
    description: "Feedback from the customer",
  })
  @Column({
    type: DataType.STRING,
    // allowNull: false,
  })
  feedback: string;
}
