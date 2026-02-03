import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    ParseIntPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';  // ← Fix: correct path
  import { CartService } from './cart.service';
  import { AddToCartDto } from './dto/add-to-cart.dto';
  import { UpdateCartItemDto } from './dto/update-cart-item.dto';
  
  @ApiTags('Корзина')
  @Controller('cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  export class CartController {
    constructor(private readonly cartService: CartService) {}
  
    @Get()
    @ApiOperation({ summary: 'Получить корзину с информацией о наличии' })
    @ApiResponse({ status: 200, description: 'Корзина получена' })
    async getCart(@Request() req) {
      return this.cartService.getCartWithAvailability(req.user.id);
    }
  
    @Post('add')
    @ApiOperation({ summary: 'Добавить товар в корзину' })
    @ApiResponse({ status: 201, description: 'Товар добавлен в корзину' })
    async addToCart(@Request() req, @Body() dto: AddToCartDto) {
      await this.cartService.addToCart(req.user.id, dto);
      return { message: 'Товар добавлен в корзину' };
    }
  
    @Put('items/:id')
    @ApiOperation({ summary: 'Обновить количество товара в корзине' })
    @ApiResponse({ status: 200, description: 'Количество обновлено' })
    async updateCartItem(
      @Request() req,
      @Param('id', ParseIntPipe) itemId: number,
      @Body() dto: UpdateCartItemDto,
    ) {
      await this.cartService.updateCartItem(req.user.id, itemId, dto);
      return { message: 'Количество обновлено' };
    }
  
    @Delete('items/:id')
    @ApiOperation({ summary: 'Удалить товар из корзины' })  // ← Fix: close brace
    @ApiResponse({ status: 200, description: 'Товар удален' })
    async removeFromCart(@Request() req, @Param('id', ParseIntPipe) itemId: number) {
      await this.cartService.removeFromCart(req.user.id, itemId);
      return { message: 'Товар удален из корзины' };
    }
  
    @Delete('clear')
    @ApiOperation({ summary: 'Очистить корзину' })
    @ApiResponse({ status: 200, description: 'Корзина очищена' })
    async clearCart(@Request() req) {
      await this.cartService.clearCart(req.user.id);
      return { message: 'Корзина очищена' };
    }
  
    @Post('merge')
    @ApiOperation({ summary: 'Объединить гостевую корзину с корзиной пользователя' })
    @ApiResponse({ status: 200, description: 'Корзины объединены' })
    async mergeGuestCart(@Request() req, @Body() guestCartItems: AddToCartDto[]) {
      await this.cartService.mergeGuestCart(req.user.id, guestCartItems);
      return { message: 'Корзины объединены' };
    }
  }