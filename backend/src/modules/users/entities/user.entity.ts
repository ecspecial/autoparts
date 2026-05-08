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
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ type: 'integer', default: 0 })
    discount: number;
  
    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;
  
    @Column({ length: 20, default: '' })
    phone: string;
  
    @Column({ type: 'varchar', length: 200, nullable: true, unique: true })
    email: string | null = null;
  
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
  
    @Column({ name: 'delivery_address', type: 'text', nullable: true })
    deliveryAddress: string | null;

    /** Ключ для внешних интеграций; отображается в ЛК; назначает администратор. */
    @Column({
      type: 'varchar',
      name: 'api_key',
      length: 512,
      nullable: true,
      unique: true,
    })
    apiKey: string | null = null;

    /** Логин партнёра из legacy Django API (совпадает с Users.login после миграции). */
    @Column({
      type: 'varchar',
      name: 'partner_legacy_login',
      length: 255,
      nullable: true,
      unique: true,
    })
    partnerLegacyLogin: string | null = null;

    /** Первичный ключ партнёра в Django `Users.id` (для связки без синтетических полей). */
    @Column({
      type: 'integer',
      name: 'django_legacy_user_id',
      nullable: true,
      unique: true,
    })
    djangoLegacyUserId: number | null = null;

    /** Зафиксированное согласие на обработку ПД (регистрация или сохранение в ЛК с чекбоксом). */
    @Column({
      type: 'timestamptz',
      name: 'personal_data_processing_consent_at',
      nullable: true,
    })
    personalDataProcessingConsentAt: Date | null = null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }