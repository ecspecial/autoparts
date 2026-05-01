import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CookieConsentLog } from './entities/cookie-consent-log.entity';

/** Согласовано с текстом баннера на фронте; при смене текста — повысить версию. */
export const DEFAULT_COOKIE_CONSENT_VERSION = 'cookie-notice-v1-2026-03';

@Injectable()
export class ConsentsService {
  private readonly logger = new Logger(ConsentsService.name);

  constructor(
    @InjectRepository(CookieConsentLog)
    private readonly logRepo: Repository<CookieConsentLog>,
  ) {}

  async recordCookieConsent(input: {
    consentVersion: string;
    ipAddress: string | null;
    userAgent: string | null;
  }): Promise<void> {
    const row = this.logRepo.create({
      consentVersion: input.consentVersion,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    });
    await this.logRepo.save(row);
    this.logger.log(
      JSON.stringify({
        event: 'cookie_consent_accepted',
        consentVersion: input.consentVersion,
        logId: row.id,
        acceptedAt: row.acceptedAt.toISOString(),
      }),
    );
  }
}
