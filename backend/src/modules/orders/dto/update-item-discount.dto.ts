import { IsInt, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemDiscountDto {
  @IsString()
  password: string;

  @IsInt()
  @Type(() => Number)
  order_id: number;

  @IsNumber()
  @Type(() => Number)
  discount: number;

  @IsNumber()
  @Type(() => Number)
  price_after_discount: number;
}
