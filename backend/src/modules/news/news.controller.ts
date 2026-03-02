import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('Новости')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все новости (из in-memory кеша)' })
  async getAll() {
    return this.newsService.getAll();
  }

  @Get('reload')
  @ApiOperation({ summary: 'Принудительно перезагрузить новости из папки' })
  async reload() {
    await this.newsService.reload();
    return { message: 'Новости перезагружены' };
  }
}