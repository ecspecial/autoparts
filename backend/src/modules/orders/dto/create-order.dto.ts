import { IsArray, ArrayMinSize, IsInt, IsBoolean, Equals } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  cartItemIds: number[];

  @IsBoolean()
  @Equals(true, {
    message: 'Необходимо согласие на обработку персональных данных',
  })
  personalDataConsent: boolean;
}