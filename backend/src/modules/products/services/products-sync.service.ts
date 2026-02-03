import { Injectable, Logger, OnModuleInit } from '@nestjs/common';  // ← Add OnModuleInit
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { CsvImportService } from './csv-import.service';
import { CategoriesCacheService } from './categories-cache.service';

@Injectable()
export class ProductsSyncService implements OnModuleInit {  // ← Implement OnModuleInit
  private readonly logger = new Logger(ProductsSyncService.name);

  constructor(
    private csvImportService: CsvImportService,
    private categoriesCache: CategoriesCacheService,
    private configService: ConfigService,
  ) {}

  // ← ADD THIS: Runs once on app startup
  async onModuleInit() {
    this.logger.log('🚀 Running initial CSV import on startup...');
    try {
      await this.syncProducts();
      this.logger.log('✅ Initial import completed successfully');
    } catch (error) {
      this.logger.error('❌ Failed to run initial import on startup', error);
      // Don't throw - allow app to start even if import fails
    }
  }

  @Cron('*/30 * * * *') // Every 30 minutes
  async syncProducts() {
    const interval = this.configService.get<number>('CSV_IMPORT_INTERVAL_MINUTES', 30);
    this.logger.log(`Starting scheduled product sync (interval: ${interval} minutes)`);

    try {
      const count = await this.csvImportService.importFromCsv();
      await this.categoriesCache.rebuildCache();
      this.logger.log(`✅ Sync completed: ${count} products imported and cache rebuilt`);
    } catch (error) {
      this.logger.error('❌ Failed to sync products', error);
      throw error;  // Re-throw for manual calls
    }
  }

  // Manual trigger for testing (optional - keep it)
  async triggerManualSync() {
    this.logger.log('🔧 Manual sync triggered');
    return this.syncProducts();
  }
}