import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(login: string, password: string, discount: number = 0) {
    // Normalize login to lowercase for case-insensitive comparison
    const normalizedLogin = login.toLowerCase().trim();
    
    // Проверяем, если пользователь уже существует
    const existingUser = await this.usersService.findByLogin(normalizedLogin);
    if (existingUser) {
        throw new ConflictException('Пользователь с таким логином уже существует');
    }
  
    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);
  
    // Создаем пользователя с нормализованным логином
    const user = await this.usersService.create(normalizedLogin, passwordHash, discount);
  
    // Генерируем JWT токен
    const payload = { sub: user.id, login: user.login, discount: user.discount };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
        login: user.login,
        discount: user.discount,
        createdAt: user.createdAt,
      },
    };
  }

  async login(login: string, password: string) {
    // Normalize login to lowercase for case-insensitive comparison
    const normalizedLogin = login.toLowerCase().trim();
    
    // Ищем пользователя
    const user = await this.usersService.findByLogin(normalizedLogin);
    if (!user) {
        throw new UnauthorizedException('Неверный логин или пароль');
    }
  
    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный логин или пароль');
    }
  
    // Генерируем JWT токен
    const payload = { sub: user.id, login: user.login, discount: user.discount };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
        login: user.login,
        discount: user.discount,
        createdAt: user.createdAt,
      },
    };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }
}