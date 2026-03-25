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

  @Post('import')
  @ApiOperation({ summary: 'Вручную запустить импорт CSV (для тестирования)' })
  @ApiResponse({ status: 200, description: 'Импорт успешно выполнен' })
  async manualImport() {
    await this.productsSyncService.triggerManualSync();
    return { message: 'Импорт CSV завершен успешно' };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Получить иерархию категорий (марки, модели, поколения)' })
  @ApiResponse({ status: 200, description: 'Категории успешно получены' })
  async getCategories(): Promise<CategoriesCache> {
    return this.categoriesCache.getCategories();
  }

  @Get('available-types')
  @ApiOperation({ summary: 'Получить доступные типы запчастей на основе текущих фильтров' })
  @ApiQuery({ name: 'marka', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'generation', required: false })
  async getAvailableTypes(
    @Query('marka') marka?: string,
    @Query('model') model?: string,
    @Query('generation') generation?: string,
  ) {
    return this.productsService.getAvailableTypes({ marka, model, generation });
  }

  @Get('search')
  @ApiOperation({ summary: 'Поиск товаров по фильтрам' })
  @ApiQuery({ name: 'marka', required: false })
  @ApiQuery({ name: 'model', required: false })
  @ApiQuery({ name: 'generation', required: false })
  @ApiQuery({ name: 'article', required: false })
  @ApiQuery({ name: 'nameKeyword', required: false, description: 'Поиск по названию товара' })
  @ApiQuery({ name: 'type', required: false, description: 'Тип запчасти' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async searchProducts(
    @Query('marka') marka?: string,
    @Query('model') model?: string,
    @Query('generation') generation?: string,
    @Query('article') article?: string,
    @Query('nameKeyword') nameKeyword?: string,
    @Query('type') type?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.productsService.search({
      marka,
      model,
      generation,
      article,
      nameKeyword,
      type,
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

  @Get('new-arrivals')
  @ApiOperation({
    summary:
      'Новинки для главной (lab с «новинк» или последние по дате, до 15 шт.)',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getNewArrivals(@Query('limit') limit?: number) {
    const n = limit != null ? Number(limit) : 15;
    const items = await this.productsService.getNewArrivals(
      Number.isFinite(n) ? n : 15,
    );
    return { items };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о товаре по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID товара' })
  @ApiResponse({ status: 200, description: 'Товар найден' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }
}
