import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { IncomingHttpHeaders } from 'http';
import { ConsentsService, DEFAULT_COOKIE_CONSENT_VERSION } from './consents.service';
import { RecordCookieConsentDto } from './dto/record-cookie-consent.dto';

/** Минимум полей запроса для IP и User-Agent (Fastify-совместимо, без пакета типов `fastify`). */
type CookieConsentRawRequest = {
  headers: IncomingHttpHeaders;
  socket?: { remoteAddress?: string };
};

function clientIp(req: CookieConsentRawRequest): string | null {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }
  if (Array.isArray(xff) && xff[0]) {
    return xff[0].trim();
  }
  const raw = req.socket?.remoteAddress;
  return raw ?? null;
}

function clientUserAgent(req: CookieConsentRawRequest): string | null {
  const ua = req.headers['user-agent'];
  if (typeof ua === 'string') return ua.slice(0, 2000);
  return null;
}

@ApiTags('Согласия')
@Controller('consents')
export class ConsentsController {
  constructor(private readonly consentsService: ConsentsService) {}

  @Post('cookie')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Зафиксировать согласие с использованием cookie / автоматической обработкой данных при посещении (для журнала на сервере)',
  })
  async recordCookie(
    @Req() req: CookieConsentRawRequest,
    @Body() dto: RecordCookieConsentDto,
  ) {
    const version = dto.consentVersion?.trim() || DEFAULT_COOKIE_CONSENT_VERSION;
    await this.consentsService.recordCookieConsent({
      consentVersion: version,
      ipAddress: clientIp(req),
      userAgent: clientUserAgent(req),
    });
    return { ok: true, consentVersion: version };
  }
}
