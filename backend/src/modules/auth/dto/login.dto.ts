import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email (уникальный идентификатор)',
  })
  @IsEmail({}, { message: 'Укажите корректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Пароль пользователя' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}