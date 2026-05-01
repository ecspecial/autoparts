import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SetClientDiscountDto {
  @ApiProperty({ description: 'Пароль администратора (как для остальных admin/users)' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description:
      'Скидка для отображения в личном кабинете (справочно), в процентах. На расчёт цены в приложении не влияет.',
    minimum: 0,
    maximum: 100,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  discount: number;
}
