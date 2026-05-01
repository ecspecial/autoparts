import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cookie_consent_logs')
export class CookieConsentLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'accepted_at', type: 'timestamptz' })
  acceptedAt: Date;

  /** Версия текста уведомления / политики для аудита. */
  @Column({ name: 'consent_version', length: 64 })
  consentVersion: string;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string | null;
}
