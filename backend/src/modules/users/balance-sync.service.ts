import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

/** Импорт balance.csv: колонка 1 — код клиента 1С, колонка 2 — сумма долга. Разделитель `;` или `,`. */
@Injectable()
export class BalanceSyncService implements OnModuleInit {
  private readonly logger = new Logger(BalanceSyncService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      const r = await this.syncFromCsv();
      if (!r.skippedFile) {
        this.logger.log(`Начальная синхронизация балансов: обновлено строк ${r.updated}`);
      }
    } catch (e) {
      this.logger.error('Начальная синхронизация балансов не удалась', e);
    }
  }

  @Cron('*/30 * * * *')
  async scheduledSync() {
    try {
      const r = await this.syncFromCsv();
      if (!r.skippedFile) {
        this.logger.log(`Балансы из CSV: обновлено строк ${r.updated}`);
      }
    } catch (e) {
      this.logger.error('Плановая синхронизация балансов не удалась', e);
    }
  }

  async syncFromCsv(): Promise<{ updated: number; skippedFile: boolean }> {
    const filePath = this.config.get<string>('BALANCE_CSV_PATH');
    if (!filePath?.trim()) {
      this.logger.debug('BALANCE_CSV_PATH не задан — пропуск');
      return { updated: 0, skippedFile: true };
    }

    const resolved = path.resolve(filePath.trim());
    let raw: string;
    try {
      raw = await fs.readFile(resolved, 'utf-8');
    } catch (e) {
      this.logger.warn(
        `Файл балансов недоступен: ${resolved} (${(e as Error).message})`,
      );
      return { updated: 0, skippedFile: true };
    }

    const rows = this.parseCsv(raw);
    if (rows.length === 0) {
      this.logger.warn(`В ${resolved} нет строк с числовой суммой`);
      return { updated: 0, skippedFile: false };
    }

    let updated = 0;
    await this.dataSource.transaction(async (manager) => {
      for (const { clientId, amount } of rows) {
        const res = await manager
          .createQueryBuilder()
          .update(User)
          .set({ balance: amount })
          .where('TRIM(client_number_1c) = :cid', { cid: clientId })
          .execute();
        updated += res.affected ?? 0;
      }
    });

    return { updated, skippedFile: false };
  }

  private parseCsv(raw: string): { clientId: string; amount: number }[] {
    const text = raw.replace(/^\uFEFF/, '');
    const lines = text.split(/\r?\n/);
    const out: { clientId: string; amount: number }[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const sep = trimmed.includes(';') ? ';' : ',';
      const parts = trimmed.split(sep).map((p) => p.trim().replace(/^"|"$/g, ''));
      if (parts.length < 2) continue;

      const clientId = parts[0].trim();
      if (!clientId) continue;

      const amount = this.parseAmount(parts[1]);
      if (!Number.isFinite(amount)) continue;

      out.push({ clientId, amount });
    }

    return out;
  }

  private parseAmount(s: string): number {
    const t = s.replace(/\s/g, '').replace(',', '.');
    return parseFloat(t);
  }
}
