import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  private getTransporter(): nodemailer.Transporter | null {
    if (this.transporter) return this.transporter;

    const host = this.config.get<string>('MAIL_SMTP_HOST');
    const portRaw = this.config.get<string | number>('MAIL_SMTP_PORT');
    const portNum = Number(portRaw ?? 465);
    const user = this.config.get<string>('MAIL_SMTP_USER');
    const pass = this.config.get<string>('MAIL_SMTP_PASS');

    if (!host || !user || pass === undefined || pass === '') {
      this.logger.warn(
        `Почта не настроена: host=${!!host} user=${!!user} passLen=${pass?.length ?? 0}`,
      );
      return null;
    }

    const secure =
      this.config.get<string>('MAIL_SMTP_SECURE') !== 'false' && portNum === 465;

    this.logger.log(
      `SMTP: host=${host} port=${portNum} secure=${secure} user=${user} passLen=${pass.length}`,
    );

    this.transporter = nodemailer.createTransport({
      host,
      port: portNum,
      secure,
      auth: { user, pass },
    });

    return this.transporter;
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    const tx = this.getTransporter();
    const from = this.config.get<string>('MAIL_FROM') || this.config.get<string>('MAIL_SMTP_USER');

    if (!tx || !from) {
      throw new Error('MAIL_NOT_CONFIGURED');
    }

    const subject = 'Восстановление пароля — Forward Autoparts';
    const html = `
      <p>Здравствуйте!</p>
      <p>Вы запросили сброс пароля для сайта. Перейдите по ссылке (действует 1 час):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Если вы не запрасывали сброс, проигнорируйте это письмо.</p>
    `;

    try {
      const info = await tx.sendMail({
        from,
        to,
        subject,
        text: `Сброс пароля: ${resetLink}`,
        html,
      });
      this.logger.log(
        `Письмо сброса пароля отправлено: to=${to} messageId=${info.messageId ?? 'n/a'}`,
      );
    } catch (err: unknown) {
      const e = err as Error & {
        code?: string;
        response?: string;
        responseCode?: number;
        command?: string;
      };
      this.logger.error(
        `sendMail failed: ${e.message} code=${e.code ?? 'n/a'} responseCode=${e.responseCode ?? 'n/a'} command=${e.command ?? 'n/a'}`,
      );
      if (e.response) {
        this.logger.error(`SMTP response: ${String(e.response).slice(0, 500)}`);
      }
      throw err;
    }
  }
}
