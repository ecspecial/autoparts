import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CsvImportService } from './csv-import.service';
import { CategoriesCacheService } from './categories-cache.service';
import { CrossCsvImportService } from '../../cross-reference/services/cross-csv-import.service';
import { DeliveryService } from '../../delivery/delivery.service';
import { NewsService } from '../../news/news.service';

@Injectable()
export class ProductsSyncService implements OnModuleInit {
  private readonly logger = new Logger(ProductsSyncService.name);

  constructor(
    private csvImportService: CsvImportService,
    private categoriesCache: CategoriesCacheService,
    private crossCsvImportService: CrossCsvImportService,
    private deliveryService: DeliveryService,
    private newsService: NewsService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('🚀 Running initial sync on startup...');
    try {
      await this.syncAll();
      this.logger.log('✅ Initial sync completed successfully');
    } catch (error) {
      this.logger.error('❌ Failed to run initial sync on startup', error);
    }
  }

  @Cron('*/30 * * * *')
  async syncAll() {
    this.logger.log('Starting scheduled sync...');

    // 1. Products — import per city (ekb + spb)
    const CITIES = ['ekb', 'spb'];
    let totalProducts = 0;
    for (const city of CITIES) {
      try {
        const count = await this.csvImportService.importFromCsvForCity(city);
        totalProducts += count;
        this.logger.log(`✅ Products sync (${city}): ${count} products imported`);
      } catch (error) {
        this.logger.error(`❌ Failed to sync products for city="${city}"`, error);
      }
    }
    await this.categoriesCache.rebuildCache();
    this.logger.log(`✅ Products sync total: ${totalProducts} products`);

    // 2. Cross-reference
    try {
      const crossResult = await this.crossCsvImportService.importFromCsv();
      this.logger.log(`✅ Cross-reference sync: ${crossResult.imported} records`);
    } catch (error) {
      this.logger.error('❌ Failed to sync cross-reference', error);
    }

    // 3. Delivery methods — per city (ekb + spb)
    for (const city of CITIES) {
      try {
        const deliveryResult = await this.deliveryService.importFromCsvForCity(city);
        this.logger.log(`✅ Delivery sync (${city}): ${deliveryResult.imported} methods`);
      } catch (error) {
        this.logger.error(`❌ Failed to sync delivery methods for city="${city}"`, error);
      }
    }

    // 4. News
    try {
      await this.newsService.reload();
      this.logger.log('✅ News cache refreshed');
    } catch (error) {
      this.logger.error('❌ Failed to reload news', error);
    }
  }

  async triggerManualSync() {
    this.logger.log('🔧 Manual sync triggered');
    return this.syncAll();
  }
}