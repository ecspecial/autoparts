import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Укажите корректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({ description: 'ID капчи (GET /auth/captcha)' })
  @IsString()
  @IsNotEmpty({ message: 'Капча обязательна' })
  captchaId: string;

  @ApiProperty({ description: 'Текст с картинки' })
  @IsString()
  @IsNotEmpty({ message: 'Введите текст с картинки' })
  captchaText: string;
}
