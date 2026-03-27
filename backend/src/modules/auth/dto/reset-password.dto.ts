import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Одноразовый токен из ссылки в письме' })
  @IsString()
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;

  @ApiProperty({ example: 'Password123!', description: 'Новый пароль (минимум 8 символов)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;
}
