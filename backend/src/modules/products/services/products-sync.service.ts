import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CsvImportService } from './csv-import.service';
import { CategoriesCacheService } from './categories-cache.service';
import { CrossCsvImportService } from '../../cross-reference/services/cross-csv-import.service';
import { DeliveryService } from '../../delivery/delivery.service';

@Injectable()
export class ProductsSyncService implements OnModuleInit {
  private readonly logger = new Logger(ProductsSyncService.name);

  constructor(
    private csvImportService: CsvImportService,
    private categoriesCache: CategoriesCacheService,
    private crossCsvImportService: CrossCsvImportService,
    private deliveryService: DeliveryService,
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

  @Cron('*/30 * * * *') // Every 30 minutes
  async syncAll() {
    this.logger.log('Starting scheduled sync...');

    // 1. Products
    try {
      const count = await this.csvImportService.importFromCsv();
      await this.categoriesCache.rebuildCache();
      this.logger.log(`✅ Products sync: ${count} products imported, cache rebuilt`);
    } catch (error) {
      this.logger.error('❌ Failed to sync products', error);
    }

    // 2. Cross-reference
    try {
      const crossResult = await this.crossCsvImportService.importFromCsv();
      this.logger.log(`✅ Cross-reference sync: ${crossResult.imported} records`);
    } catch (error) {
      this.logger.error('❌ Failed to sync cross-reference', error);
    }

    // 3. Delivery methods
    try {
      const deliveryResult = await this.deliveryService.importFromCsv();
      this.logger.log(`✅ Delivery sync: ${deliveryResult.imported} methods`);
    } catch (error) {
      this.logger.error('❌ Failed to sync delivery methods', error);
    }
  }

  async triggerManualSync() {
    this.logger.log('🔧 Manual sync triggered');
    return this.syncAll();
  }
}