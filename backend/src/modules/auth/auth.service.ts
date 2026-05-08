import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CaptchaService } from './captcha.service';
import { MailService } from './mail.service';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { createHash, randomBytes } from 'crypto';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 час

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private captchaService: CaptchaService,
    private configService: ConfigService,
    private mailService: MailService,
    @InjectRepository(PasswordResetToken)
    private passwordResetRepo: Repository<PasswordResetToken>,
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

    void this.mailService
      .notifyNewRegistration({
        id: user.id,
        email: normalizedEmail,
        fullName: user.fullName,
        phone: user.phone,
        entityType: user.entityType,
      })
      .catch((err) =>
        this.logger.warn(`Уведомление о регистрации не отправлено: ${(err as Error).message}`),
      );
  
    // 5. Generate JWT
    const payload = { sub: user.id, email: normalizedEmail };
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
        email: normalizedEmail,
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
  
    const payload = { sub: user.id, email: user.email ?? '' };
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

  /** Одинаковый ответ при любом email — защита от перебора адресов */
  private static readonly FORGOT_PASSWORD_MESSAGE =
    'Если указанный email зарегистрирован, мы отправили на него инструкцию по восстановлению пароля.';

  async requestPasswordReset(dto: {
    email: string;
    captchaId: string;
    captchaText: string;
  }) {
    const captchaValid = this.captchaService.verify(dto.captchaId, dto.captchaText);
    if (!captchaValid) {
      throw new BadRequestException('Неверный текст капчи. Попробуйте ещё раз.');
    }

    const normalizedEmail = dto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmailNormalized(normalizedEmail);
    if (!user) {
      return { message: AuthService.FORGOT_PASSWORD_MESSAGE };
    }

    if (!user.email?.trim()) {
      return { message: AuthService.FORGOT_PASSWORD_MESSAGE };
    }

    await this.passwordResetRepo.delete({ userId: user.id });

    const plainToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(plainToken).digest('hex');
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);

    await this.passwordResetRepo.save(
      this.passwordResetRepo.create({
        userId: user.id,
        tokenHash,
        expiresAt,
      }),
    );

    const baseUrl =
      this.configService.get<string>('FRONTEND_PUBLIC_URL')?.replace(/\/$/, '') ||
      'http://localhost:5173';
    const resetLink = `${baseUrl}/reset-password?token=${plainToken}`;

    try {
      const toAddr = user.email.trim();
      await this.mailService.sendPasswordResetEmail(toAddr, resetLink);
    } catch (e) {
      const err = e as Error;
      this.logger.error(
        `Сброс пароля: отправка не удалась (userId=${user.id}): ${err.message}`,
        err.stack,
      );
      await this.passwordResetRepo.delete({ userId: user.id });
      throw new ServiceUnavailableException(
        'Не удалось отправить письмо. Попробуйте позже или обратитесь к администратору.',
      );
    }

    return { message: AuthService.FORGOT_PASSWORD_MESSAGE };
  }

  async resetPassword(dto: { token: string; password: string }) {
    const tokenHash = createHash('sha256').update(dto.token.trim()).digest('hex');
    const row = await this.passwordResetRepo.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!row || row.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Ссылка недействительна или истекла. Запросите новую.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.usersService.updatePasswordHash(row.userId, passwordHash);
    await this.passwordResetRepo.delete({ id: row.id });

    return { message: 'Пароль успешно изменён. Вы можете войти с новым паролем.' };
  }
}