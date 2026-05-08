import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import {
  DjangoBridgeCreateOrderDto,
  DjangoBridgeOrderDetailsDto,
} from './dto/django-integration.dto';

/**
 * Внутренний мост: Django B2B после проверки login/password вызывает Nest с bridge_secret.
 */
@ApiTags('Интеграции Django')
@Controller('integrations/django')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }),
)
export class DjangoIntegrationsOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private assertBridgeSecret(secret: string | undefined): void {
    const expected = process.env.DJANGO_ORDER_BRIDGE_SECRET?.trim();
    if (!expected) {
      throw new InternalServerErrorException({
        code: '5001',
        message: 'DJANGO_ORDER_BRIDGE_SECRET is not configured on API',
      });
    }
    if (!secret || secret !== expected) {
      throw new UnauthorizedException({
        code: '9001',
        message: 'Invalid bridge_secret',
      });
    }
  }

  @Post('create-order')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() body: DjangoBridgeCreateOrderDto) {
    this.assertBridgeSecret(body.bridge_secret);
    const orderId = await this.ordersService.createOrderFromDjangoBridge(
      body.partner_login,
      body.order,
    );
    return { code: '0', message: 'Ok', order_id: orderId };
  }

  @Post('order-details')
  @HttpCode(HttpStatus.OK)
  async orderDetails(@Body() body: DjangoBridgeOrderDetailsDto) {
    this.assertBridgeSecret(body.bridge_secret);
    return this.ordersService.getPartnerOrderDetailsForLegacy(
      body.partner_login,
      body.order_id,
      'classic',
    );
  }

  @Post('order-details-m')
  @HttpCode(HttpStatus.OK)
  async orderDetailsMarket(@Body() body: DjangoBridgeOrderDetailsDto) {
    this.assertBridgeSecret(body.bridge_secret);
    return this.ordersService.getPartnerOrderDetailsForLegacy(
      body.partner_login,
      body.order_id,
      'market',
    );
  }
}
