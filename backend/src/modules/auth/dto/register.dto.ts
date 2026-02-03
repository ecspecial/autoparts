import { IsString, IsNotEmpty, MinLength, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'user123', 
    description: 'Логин пользователя (уникальный)' 
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Пароль (минимум 8 символов)' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @ApiPropertyOptional({ 
    example: 5, 
    description: 'Уровень скидки (от 0 до 16)', 
    default: 0 
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(16)
  discount?: number;
}