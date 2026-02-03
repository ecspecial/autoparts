import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Пользователь успешно зарегистрирован',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          login: 'user123',
          discount: 5,
          createdAt: '2026-01-31T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Пользователь с таким логином уже существует' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные запроса' 
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.login,
      registerDto.password,
      registerDto.discount,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход пользователя в систему' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь успешно авторизован',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          login: 'user123',
          discount: 5,
          createdAt: '2026-01-31T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Неверный логин или пароль' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректные данные запроса' 
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.login, loginDto.password);
  }
}