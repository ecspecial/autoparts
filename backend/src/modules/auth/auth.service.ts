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

    const normalizedEmail = dto.email.toLowerCase().trim();

    const existingByEmail = await this.usersService.findByEmailNormalized(normalizedEmail);
    if (existingByEmail) {
      throw new ConflictException('Пользователь с таким email уже зарегистрирован');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);
  
    // 4. Create user
    const user = await this.usersService.create({
      passwordHash,
      phone: dto.phone.trim(),
      email: normalizedEmail,
      entityType: dto.entityType,
      fullName: dto.fullName.trim(),
      discount: dto.discount,
    });
  
    // 5. Generate JWT
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
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

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.usersService.findByEmailNormalized(normalizedEmail);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }
  
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      user: {
        id: user.id,
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