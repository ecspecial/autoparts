import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    login: string;
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ type: 'integer', default: 0 })
    discount: number;
  
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;
  
    @Column({ length: 20, default: '' })
    phone: string;
  
    @Column({ length: 200, default: '' })
    email: string;
  
    @Column({ name: 'entity_type', length: 20, default: 'individual' })
    entityType: string; // 'individual' | 'legal'
  
    @Column({ name: 'full_name', length: 300, default: '' })
    fullName: string; // ФИО or org name
  
    @Column({ type: 'varchar', name: 'client_number_1c', length: 50, nullable: true })
    clientNumber1c: string | null = null;
  
    @Column({ name: 'is_active', default: false })
    isActive: boolean;
  
    @Column({ type: 'varchar', name: 'preferred_delivery', length: 200, nullable: true })
    preferredDelivery: string | null;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }