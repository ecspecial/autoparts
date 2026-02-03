import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'user123', 
    description: 'Логин пользователя' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Логин обязателен' })
  login: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Пароль пользователя' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}