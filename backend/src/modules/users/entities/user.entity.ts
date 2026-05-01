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
  
    @Column({ length: 200, default: '', unique: true })
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