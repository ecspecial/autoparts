import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login } });
  }

  async create(data: {
    login: string;
    passwordHash: string;
    phone: string;
    email: string;
    entityType: string;
    fullName: string;
    discount?: number;
  }): Promise<User> {
    const user = this.usersRepository.create({
      login: data.login,
      passwordHash: data.passwordHash,
      phone: data.phone,
      email: data.email,
      entityType: data.entityType,
      fullName: data.fullName,
      discount: data.discount || 0,
      balance: 0,
      isActive: false,
      clientNumber1c: null,
    });
    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // Get user profile (safe fields only)
  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    return {
      id: user.id,
      login: user.login,
      phone: user.phone,
      email: user.email,
      entityType: user.entityType,
      fullName: user.fullName,
      discount: user.discount,
      balance: Number(user.balance),
      isActive: user.isActive,
      clientNumber1c: user.clientNumber1c,
      preferredDelivery: user.preferredDelivery,
      createdAt: user.createdAt,
    };
  }

  // Update delivery method by user
  async updateDelivery(userId: number, deliveryCode: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.preferredDelivery = deliveryCode;
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

  // Admin: update user balance
  async updateBalance(userId: number, balance: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден');
    user.balance = balance;
    return this.usersRepository.save(user);
  }
}