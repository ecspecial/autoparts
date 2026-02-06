import { Controller, Get, Post, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CategoriesCacheService, CategoriesCache } from './services/categories-cache.service';
import { ProductsSyncService } from './services/products-sync.service';

@ApiTags('Товары')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesCache: CategoriesCacheService,
    private readonly productsSyncService: ProductsSyncService,
  ) {}

  // Order matters! Specific routes FIRST, dynamic routes LAST

  @Post('import')  // ← 1. POST /products/import (specific)
  @ApiOperation({ summary: 'Вручную запустить импорт CSV (для тестирования)' })
  @ApiResponse({ status: 200, description: 'Импорт успешно выполнен' })
  async manualImport() {
    await this.productsSyncService.triggerManualSync();
    return { message: 'Импорт CSV завершен успешно' };
  }

  @Get('categories')  // ← 2. GET /products/categories (specific)
  @ApiOperation({ summary: 'Получить иерархию категорий (марки, модели, поколения)' })
  @ApiResponse({ status: 200, description: 'Категории успешно получены' })
  async getCategories(): Promise<CategoriesCache> {
    return this.categoriesCache.getCategories();
  }

  @Get('search')
@ApiOperation({ summary: 'Поиск товаров по фильтрам' })
@ApiQuery({ name: 'marka', required: false })
@ApiQuery({ name: 'model', required: false })
@ApiQuery({ name: 'generation', required: false })
@ApiQuery({ name: 'article', required: false })
@ApiQuery({ name: 'nameKeyword', required: false, description: 'Поиск по названию товара' })
@ApiQuery({ name: 'page', required: false })
@ApiQuery({ name: 'limit', required: false })
async searchProducts(
  @Query('marka') marka?: string,
  @Query('model') model?: string,
  @Query('generation') generation?: string,
  @Query('article') article?: string,
  @Query('nameKeyword') nameKeyword?: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  return this.productsService.search({
    marka,
    model,
    generation,
    article,
    nameKeyword,
    page,
    limit,
  });
}

@Get('search-by-oem')
@ApiOperation({ summary: 'Search products by OEM/manufacturer article number' })
@ApiQuery({ name: 'oem', required: true, description: 'OEM article number (e.g., 6001546685)' })
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
async searchByOem(
  @Query('oem') oem: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
) {
  return this.productsService.searchByOem(oem, page, limit);
}

  @Get(':id')  // ← 4. GET /products/:id (dynamic - MUST BE LAST!)
  @ApiOperation({ summary: 'Получить информацию о товаре по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Get('unified-search')
  @ApiOperation({ summary: 'Unified search by article and OEM simultaneously' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query (article or OEM number)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async unifiedSearch(
  @Query('q') q: string,
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 20,
  ) {
  return this.productsService.unifiedSearch(q, page, limit);
  }

}
