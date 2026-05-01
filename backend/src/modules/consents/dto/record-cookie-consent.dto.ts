import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/** Тело опционально; версия по умолчанию задаётся на сервере. */
export class RecordCookieConsentDto {
  @ApiPropertyOptional({
    description: 'Версия текста согласия (если не передана — используется версия сервера)',
    example: 'cookie-notice-v1-2026-03',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  consentVersion?: string;
}
