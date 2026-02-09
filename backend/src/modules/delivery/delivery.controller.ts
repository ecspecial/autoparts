import {
    Controller,
    Get,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  import { DeliveryService } from './delivery.service';
  
  @ApiTags('Доставка')
  @Controller('delivery')
  export class DeliveryController {
    private readonly IMPORT_PASSWORD = process.env.CROSS_IMPORT_PASSWORD || 'change-me';
  
    constructor(private readonly deliveryService: DeliveryService) {}
  
    @Get('methods')
    @ApiOperation({ summary: 'Получить все доступные способы доставки' })
    @ApiResponse({ status: 200, description: 'Список способов доставки' })
    async getMethods() {
      return this.deliveryService.findAll();
    }
  
    @Post('import')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Импортировать способы доставки из CSV (ручной запуск)' })
    async importDelivery(@Body() body: { password: string }) {
      if (body.password !== this.IMPORT_PASSWORD) {
        throw new UnauthorizedException('Invalid password');
      }
      const result = await this.deliveryService.importFromCsv();
      return { success: true, ...result };
    }
  }