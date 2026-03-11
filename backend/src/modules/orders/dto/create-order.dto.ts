import { IsArray, ArrayMinSize, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  cartItemIds: number[];
}