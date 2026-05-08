import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not, QueryFailedError } from 'typeorm';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** Регистрация: email считается уникальным (без учёта регистра и краёв пробелов) */
  async findByEmailNormalized(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    if (!normalized) return null;
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(TRIM(user.email)) = :email', { email: normalized })
      .getOne();
  }

  async create(data: {
    passwordHash: string;
    phone: string;
    email: string;
    entityType: string;
    fullName: string;
    discount?: number;
  }): Promise<User> {
    const user = this.usersRepository.create({
      passwordHash: data.passwordHash,
      phone: data.phone,
      email: data.email.toLowerCase().trim(),
      entityType: data.entityType,
      fullName: data.fullName,
      discount: data.discount || 0,
      balance: 0,
      isActive: false,
      clientNumber1c: null,
      personalDataProcessingConsentAt: new Date(),
    });
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updatePasswordHash(userId: number, passwordHash: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { passwordHash });
  }

  // Get user profile (safe fields only)
  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return {
      id: user.id,
      phone: user.phone,
      email: user.email,
      entityType: user.entityType,
      fullName: user.fullName,
      discount: user.discount,
      balance: Number(user.balance),
      isActive: user.isActive,
      clientNumber1c: user.clientNumber1c,
      preferredDelivery: user.preferredDelivery,
      deliveryAddress: user.deliveryAddress,
      apiKey: user.apiKey,
      personalDataConsentAt: user.personalDataProcessingConsentAt?.toISOString() ?? null,
      createdAt: user.createdAt,
    };
  }

  private ensurePersonalDataConsentRecorded(user: User, consentAcknowledged?: boolean): void {
    if (user.personalDataProcessingConsentAt != null) {
      return;
    }
    if (!consentAcknowledged) {
      throw new BadRequestException(
        'Необходимо согласие на обработку персональных данных',
      );
    }
    user.personalDataProcessingConsentAt = new Date();
  }

  // Update delivery method by user
  async updateDelivery(
    userId: number,
    deliveryCode: string,
    deliveryName?: string,
    personalDataConsent?: boolean,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    this.ensurePersonalDataConsentRecorded(user, personalDataConsent);

    user.preferredDelivery = deliveryCode;
    
    // If delivery contains "САМОВЫВОЗ", clear address
    if (deliveryName && deliveryName.includes('САМОВЫВОЗ')) {
      user.deliveryAddress = null;
    }
    
    await this.usersRepository.save(user);
  }

  async updateDeliveryAddress(
    userId: number,
    address: string | null,
    personalDataConsent?: boolean,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');

    this.ensurePersonalDataConsentRecorded(user, personalDataConsent);

    user.deliveryAddress = address;
    await this.usersRepository.save(user);
  }

  // Admin: get pending users (no 1C number)
  async findPending(): Promise<User[]> {
    return this.usersRepository.find({
      where: { clientNumber1c: IsNull() },
      order: { createdAt: 'DESC' },
    });
  }

  // Admin: get active users (with 1C number)
  async findActive(): Promise<User[]> {
    return this.usersRepository.find({
      where: { clientNumber1c: Not(IsNull()) },
      order: { createdAt: 'DESC' },
    });
  }

  // Admin: activate user with 1C number
  async activate(userId: number, clientNumber1c: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.clientNumber1c = clientNumber1c;
    user.isActive = true;
    return this.usersRepository.save(user);
  }

  /** Admin: снять клиентский номер 1С и деактивировать (обратно к activate) */
  async deactivate(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.clientNumber1c = null;
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  // Admin: update user balance
  async updateBalance(userId: number, balance: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.balance = balance;
    return this.usersRepository.save(user);
  }

  /** Справочное значение скидки для ЛК клиента (не участвует в расчёте цен на сайте). */
  async updateClientDiscount(userId: number, discount: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.discount = discount;
    return this.usersRepository.save(user);
  }

  /** Установить API-ключ клиенту (значение формирует администратор; уникально в таблице). */
  async updateUserApiKey(userId: number, apiKey: string): Promise<User> {
    const key = apiKey.trim();
    if (!key) {
      throw new BadRequestException('API-ключ не может быть пустым');
    }
    const other = await this.usersRepository.findOne({ where: { apiKey: key } });
    if (other && other.id !== userId) {
      throw new ConflictException('Этот API-ключ уже присвоен другому пользователю');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.apiKey = key;
    return this.usersRepository.save(user);
  }

  /** Поиск клиента для Django-моста (логин из API, email/1С или стабильный Django id). */
  async findForDjangoBridgePartner(
    partnerLogin: string,
    legacyUserId?: number | null,
  ): Promise<User | null> {
    const trimmed = String(partnerLogin ?? '').trim();
    const qb = this.usersRepository.createQueryBuilder('u');
    const parts: string[] = [];
    const params: Record<string, unknown> = {};

    if (trimmed) {
      parts.push('u.partner_legacy_login = :trimmed');
      parts.push('LOWER(TRIM(u.email)) = LOWER(:trimmed)');
      parts.push(
        '(u.client_number_1c IS NOT NULL AND TRIM(u.client_number_1c) = :trimmed)',
      );
      params.trimmed = trimmed;
    }

    if (legacyUserId != null && Number.isFinite(Number(legacyUserId))) {
      parts.push('u.django_legacy_user_id = :lid');
      params.lid = Number(legacyUserId);
    }

    if (parts.length === 0) {
      return null;
    }

    qb.where(`(${parts.join(' OR ')})`, params);
    return qb.getOne();
  }

  /**
   * Авто-создание записи клиента из доверенных данных Django (без вымышленной почты и т.п.).
   */
  async provisionPartnerFromDjangoBridge(params: {
    partnerLogin: string;
    legacyUserId?: number | null;
    legacyDiscount?: number | null;
  }): Promise<User> {
    const login = params.partnerLogin.trim();
    if (!login) {
      throw new BadRequestException('partner_login пуст');
    }

    const discount = Math.max(
      0,
      Math.min(100, Math.round(Number(params.legacyDiscount ?? 0))),
    );

    const rnd = randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(rnd, 10);

    const djangoId =
      params.legacyUserId != null && Number.isFinite(Number(params.legacyUserId))
        ? Number(params.legacyUserId)
        : null;

    const user = this.usersRepository.create({
      passwordHash,
      phone: '',
      email: null,
      entityType: 'individual',
      fullName: '',
      discount,
      balance: 0,
      isActive: true,
      clientNumber1c: null,
      partnerLegacyLogin: login,
      djangoLegacyUserId: djangoId,
      personalDataProcessingConsentAt: null,
      preferredDelivery: null,
      deliveryAddress: null,
      apiKey: null,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        typeof (e as QueryFailedError & { driverError?: { code?: string } })
          .driverError === 'object' &&
        (e as QueryFailedError & { driverError?: { code?: string } }).driverError
          ?.code === '23505'
      ) {
        const again = await this.findForDjangoBridgePartner(login, djangoId);
        if (again) {
          return again;
        }
      }
      throw e;
    }
  }
}