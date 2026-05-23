import { IsInt, Min, Max, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class SetClientDiscountBy1cDto {
  @ApiProperty({ description: 'Пароль администратора (как для остальных admin/users)' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Номер клиента в 1С (как в users.client_number_1c)',
    example: 'К-00001234',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Укажите client_number_1c' })
  client_number_1c: string;

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
