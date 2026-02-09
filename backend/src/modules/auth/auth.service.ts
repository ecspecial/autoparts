import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CaptchaService } from './captcha.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private captchaService: CaptchaService,
  ) {}

  async register(dto: {
    login: string;
    password: string;
    phone: string;
    email: string;
    entityType: string;
    fullName: string;
    captchaId: string;
    captchaText: string;
    discount?: number;
  }) {
    // 1. Verify captcha
    const captchaValid = this.captchaService.verify(dto.captchaId, dto.captchaText);
    if (!captchaValid) {
      throw new BadRequestException('Неверный текст капчи. Попробуйте ещё раз.');
    }

    // 2. Normalize login
    const normalizedLogin = dto.login.toLowerCase().trim();
    
    // 3. Check existing user
    const existingUser = await this.usersService.findByLogin(normalizedLogin);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }
  
    // 4. Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);
  
    // 5. Create user
    const user = await this.usersService.create({
      login: normalizedLogin,
      passwordHash,
      phone: dto.phone.trim(),
      email: dto.email.trim(),
      entityType: dto.entityType,
      fullName: dto.fullName.trim(),
      discount: dto.discount,
    });
  
    // 6. Generate JWT
    const payload = { sub: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
        login: user.login,
        discount: user.discount,
        balance: Number(user.balance),
        isActive: user.isActive,
        entityType: user.entityType,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async login(login: string, password: string) {
    const normalizedLogin = login.toLowerCase().trim();
    
    const user = await this.usersService.findByLogin(normalizedLogin);
    if (!user) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  
    const payload = { sub: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
        login: user.login,
        discount: user.discount,
        balance: Number(user.balance),
        isActive: user.isActive,
        entityType: user.entityType,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async validateUser(userId: number) {
    return this.usersService.findById(userId);
  }
}