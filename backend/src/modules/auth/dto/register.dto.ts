import { IsString, IsNotEmpty, MinLength, IsOptional, IsInt, Min, Max, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Password123!', description: 'Пароль (минимум 8 символов)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @ApiProperty({ example: '+79991234567', description: 'Телефон' })
  @IsString()
  @IsNotEmpty({ message: 'Телефон обязателен' })
  phone: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email (уникальный)' })
  @IsEmail({}, { message: 'Укажите корректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({ example: 'individual', description: 'Тип: individual или legal' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ example: 'Иванов Иван Иванович', description: 'ФИО или наименование организации' })
  @IsString()
  @IsNotEmpty({ message: 'ФИО / Наименование организации обязательно' })
  fullName: string;

  @ApiProperty({ description: 'ID капчи (из GET /auth/captcha)' })
  @IsString()
  @IsNotEmpty({ message: 'Капча обязательна' })
  captchaId: string;

  @ApiProperty({ description: 'Текст введенный пользователем с картинки' })
  @IsString()
  @IsNotEmpty({ message: 'Введите текст с картинки' })
  captchaText: string;

  @ApiPropertyOptional({ example: 5, description: 'Уровень скидки (от 0 до 16)', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(16)
  discount?: number;
}