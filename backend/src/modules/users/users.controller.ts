import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
  import { UsersService } from './users.service';
  
  @ApiTags('Пользователи')
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
    async getProfile(@Request() req) {
      return this.usersService.getProfile(req.user.id);
    }
  
    @Patch('delivery')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Обновить способ доставки пользователя' })
    async updateDelivery(
    @Request() req,
    @Body()
    body: {
      deliveryCode: string;
      deliveryName?: string;
      personalDataConsent?: boolean;
    },
    ) {
    await this.usersService.updateDelivery(
      req.user.id,
      body.deliveryCode,
      body.deliveryName,
      body.personalDataConsent,
    );
    return { message: 'Способ доставки обновлен' };
    }

    @Patch('delivery-address')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Обновить адрес доставки' })
    async updateDeliveryAddress(
    @Request() req,
    @Body() body: { address: string | null; personalDataConsent?: boolean },
    ) {
    await this.usersService.updateDeliveryAddress(
      req.user.id,
      body.address,
      body.personalDataConsent,
    );
    return { message: 'Адрес доставки обновлен' };
    }
  }