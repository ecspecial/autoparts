import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CsvImportService } from './services/csv-import.service';
import { CategoriesCacheService } from './services/categories-cache.service';
import { ProductsSyncService } from './services/products-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CsvImportService,
    CategoriesCacheService,
    ProductsSyncService,
  ],
  exports: [ProductsService, CategoriesCacheService],
})
export class ProductsModule {}