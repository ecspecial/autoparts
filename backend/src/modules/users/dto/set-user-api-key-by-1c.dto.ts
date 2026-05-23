import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SetUserApiKeyBy1cDto {
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
    description: 'Значение ключа задаётся вручную; должен быть уникален среди пользователей.',
    example: 'apik_live_xxxxx',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  apiKey: string;
}
