import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Request,
    UseGuards,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
  import { OrdersService } from './orders.service';
  import { CreateOrderDto } from './dto/create-order.dto';
  
  @ApiTags('Заказы')
  @Controller('orders')
  export class OrdersController {
    private readonly ADMIN_PASSWORD =
      process.env.CROSS_IMPORT_PASSWORD || 'change-me';
  
    constructor(private readonly ordersService: OrdersService) {}
  
    private checkPassword(password: string) {
      if (password !== this.ADMIN_PASSWORD) {
        throw new UnauthorizedException('Неверный пароль');
      }
    }
  
    // ── Клиентские методы (JWT) ────────────────────────────────────────────
  
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Оформить заказ из выбранных позиций корзины' })
    createOrder(@Request() req, @Body() dto: CreateOrderDto) {
      return this.ordersService.createOrder(req.user.id, dto);
    }
  
    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Получить мои заказы' })
    getMyOrders(@Request() req) {
      return this.ordersService.getUserOrders(req.user.id);
    }
  
    // ── 1С / admin (password in body) ─────────────────────────────────────
  
    @Post('1c/unprocessed')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '1С: Необработанные заказы (status = null)' })
    getUnprocessedOrders(@Body() body: { password: string }) {
      this.checkPassword(body.password);
      return this.ordersService.getUnprocessedOrders();
    }
  
    @Post('1c/order/:id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '1С: Установить статус заказа' })
    updateOrderStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string; status: string },
    ) {
      this.checkPassword(body.password);
      return this.ordersService.updateOrderStatus(id, body.status);
    }
  
    @Post('1c/item/:id/status')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '1С: Установить статус позиции заказа' })
    updateItemStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string; status: string },
    ) {
      this.checkPassword(body.password);
      return this.ordersService.updateItemStatus(id, body.status);
    }
  
    @Post('1c/item/:id/reject')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '1С: Отказ по позиции — статус + обнуление суммы' })
    rejectItem(
      @Param('id', ParseIntPipe) id: number,
      @Body() body: { password: string; status: string },
    ) {
      this.checkPassword(body.password);
      return this.ordersService.rejectItem(id, body.status);
    }

    @Post('1c/all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '1С: Все заказы' })
    getAllOrders(@Body() body: { password: string }) {
    this.checkPassword(body.password);
    return this.ordersService.getAllOrders();
    }
  }