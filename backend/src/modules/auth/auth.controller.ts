import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CaptchaService } from './captcha.service';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private captchaService: CaptchaService,
  ) {}

  @Get('captcha')
  @ApiOperation({ summary: 'Получить SVG капчу для регистрации' })
  @ApiResponse({ status: 200, description: 'Капча сгенерирована' })
  getCaptcha() {
    return this.captchaService.generate();
  }

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким логином уже существует' })
  @ApiResponse({ status: 400, description: 'Некорректные данные запроса' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      login: registerDto.login,
      password: registerDto.password,
      phone: registerDto.phone,
      email: registerDto.email,
      entityType: registerDto.entityType,
      fullName: registerDto.fullName,
      captchaId: registerDto.captchaId,
      captchaText: registerDto.captchaText,
      discount: registerDto.discount,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход пользователя в систему' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно авторизован' })
  @ApiResponse({ status: 401, description: 'Неверный логин или пароль' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.login, loginDto.password);
  }
}