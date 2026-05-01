import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SetUserApiKeyDto {
  @ApiProperty({ description: 'Пароль администратора (как для остальных admin/users)' })
  @IsString()
  @IsNotEmpty()
  password: string;

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
