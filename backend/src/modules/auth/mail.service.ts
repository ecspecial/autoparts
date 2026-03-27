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
    const port = this.config.get<number>('MAIL_SMTP_PORT') ?? 465;
    const user = this.config.get<string>('MAIL_SMTP_USER');
    const pass = this.config.get<string>('MAIL_SMTP_PASS');

    if (!host || !user || pass === undefined || pass === '') {
      this.logger.warn(
        'Почта не настроена (MAIL_SMTP_HOST / MAIL_SMTP_USER / MAIL_SMTP_PASS). Письма отправляться не будут.',
      );
      return null;
    }

    const secure =
      this.config.get<string>('MAIL_SMTP_SECURE') !== 'false' && port === 465;

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
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

    await tx.sendMail({
      from,
      to,
      subject,
      text: `Сброс пароля: ${resetLink}`,
      html,
    });
  }
}
