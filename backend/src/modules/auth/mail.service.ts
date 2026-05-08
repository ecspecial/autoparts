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

  /** Уведомления менеджерам (не бросает ошибку наружу) */
  private async sendToManager(subject: string, html: string, text: string): Promise<void> {
    const to = this.config.get<string>('MANAGER_NOTIFY_EMAIL')?.trim();
    if (!to) {
      this.logger.debug('MANAGER_NOTIFY_EMAIL не задан — уведомление пропущено');
      return;
    }
    const tx = this.getTransporter();
    const from = this.config.get<string>('MAIL_FROM') || this.config.get<string>('MAIL_SMTP_USER');
    if (!tx || !from) {
      this.logger.warn('Почта не настроена — уведомление менеджеру не отправлено');
      return;
    }
    try {
      await tx.sendMail({ from, to, subject, html, text });
      this.logger.log(`Уведомление менеджеру: ${subject} → ${to}`);
    } catch (err: unknown) {
      const e = err as Error;
      this.logger.warn(`Не удалось отправить уведомление менеджеру: ${e.message}`);
    }
  }

  async notifyNewRegistration(data: {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    entityType: string;
  }): Promise<void> {
    const subject = `Новая регистрация на сайте — ${data.fullName || data.email}`;
    const html = `
      <p>Зарегистрирован новый пользователь.</p>
      <ul>
        <li><strong>ID:</strong> ${data.id}</li>
        <li><strong>ФИО / организация:</strong> ${escapeHtml(data.fullName)}</li>
        <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
        <li><strong>Телефон:</strong> ${escapeHtml(data.phone)}</li>
        <li><strong>Тип:</strong> ${data.entityType === 'legal' ? 'Юр. лицо' : 'Физ. лицо'}</li>
      </ul>
    `;
    const text = `Новый пользователь id=${data.id}, ${data.fullName}, ${data.email}, ${data.phone}`;
    await this.sendToManager(subject, html, text);
  }

  async notifyNewSiteOrder(data: {
    orderId: number;
    reference: string;
    fullName: string;
    email: string | null;
    phone: string;
    clientNumber1c: string | null;
    /** 'site' по умолчанию; 'API' для партнёрских заказов через Django bridge. */
    orderSource?: string | null;
    items: { article: string; name: string; quantity: number; price: number }[];
  }): Promise<void> {
    const lines = data.items
      .map(
        (i) =>
          `<tr><td>${escapeHtml(i.article)}</td><td>${escapeHtml(i.name)}</td><td>${i.quantity}</td><td>${i.price}</td></tr>`,
      )
      .join('');
    const source = data.orderSource === 'API' ? ' (API)' : ' с сайта';
    const subject = `Заказ${source} ${data.reference} — ${data.fullName || data.email || 'API-клиент'}`;
    const html = `
      <p><strong>${escapeHtml(data.fullName)}</strong> оформил заказ${data.orderSource === 'API' ? ' через партнёрское API' : ' на сайте'}.</p>
      <p>Номер: <strong>${escapeHtml(data.reference)}</strong> (id ${data.orderId})</p>
      <p>Email: ${data.email ? escapeHtml(data.email) : '—'} · Телефон: ${escapeHtml(data.phone)}${
        data.clientNumber1c
          ? ` · Клиент 1С: ${escapeHtml(data.clientNumber1c)}`
          : ''
      }</p>
      <table border="1" cellpadding="6" cellspacing="0">
        <thead><tr><th>Артикул</th><th>Наименование</th><th>Кол-во</th><th>Цена</th></tr></thead>
        <tbody>${lines}</tbody>
      </table>
    `;
    const text = `Заказ ${data.reference}\n${data.fullName}\n${data.email ?? ''}\n${data.items.map((i) => `${i.article} x${i.quantity}`).join('\n')}`;
    await this.sendToManager(subject, html, text);
  }
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
