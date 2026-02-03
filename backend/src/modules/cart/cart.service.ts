import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items'],
    });
  
    if (!cart) {
      const newCart = new Cart();
      newCart.userId = userId;
      newCart.items = [];
      cart = await this.cartRepository.save(newCart);
    }
  
    return cart;
  }

  async getCartWithAvailability(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    // Get current product info for each cart item by article
    const itemsWithAvailability = await Promise.all(
        cart.items.map(async (item) => {
          const currentProduct = await this.productRepository.findOne({
            where: { article: item.article },
          });
      
          return {
            id: item.id,
            article: item.article,
            name: item.name,
            fullName: item.fullName,
            marka: item.marka,
            model: item.model,
            priceSnapshot: Number(item.priceSnapshot),
            quantity: item.quantity,
            addedAt: item.addedAt,
            // Current availability
            available: !!currentProduct,
            currentPrice: currentProduct ? Number(currentProduct.price) : null,  // ← Fix: use Number()
            currentStock: currentProduct ? currentProduct.quantity : 0,
            priceChanged: currentProduct
              ? Number(currentProduct.price) !== Number(item.priceSnapshot)  // ← Fix: use Number()
              : false,
          };
        }),
      );

    return {
        cartId: cart.id,
        items: itemsWithAvailability,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: cart.items.reduce(
          (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,  // ← Fix: Use Number()
          0,
        ),
      };
  }

  async addToCart(userId: number, dto: AddToCartDto): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
  
    // Check current product stock
    const currentProduct = await this.productRepository.findOne({
      where: { article: dto.article },
    });
  
    if (!currentProduct) {
      throw new NotFoundException('Товар не найден в каталоге');
    }
  
    if (currentProduct.quantity < dto.quantity) {
      throw new BadRequestException(
        `Недостаточно товара на складе. Доступно: ${currentProduct.quantity} шт.`,
      );
    }
  
    // Check if item already in cart
    const existingItem = cart.items.find((item) => item.article === dto.article);
  
    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      
      // Validate total quantity doesn't exceed stock
      if (newQuantity > currentProduct.quantity) {
        throw new BadRequestException(
          `Недостаточно товара на складе. Доступно: ${currentProduct.quantity} шт., в корзине уже: ${existingItem.quantity} шт.`,
        );
      }
      
      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        article: dto.article,
        name: dto.name,
        fullName: dto.fullName,
        marka: dto.marka,
        model: dto.model,
        priceSnapshot: dto.priceSnapshot,
        quantity: dto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }
  }

  async updateCartItem(
    userId: number,
    cartItemId: number,
    dto: UpdateCartItemDto,
  ): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === cartItemId);
  
    if (!item) {
      throw new NotFoundException('Товар не найден в корзине');
    }
  
    // ✅ ADD STOCK VALIDATION
    const currentProduct = await this.productRepository.findOne({
      where: { article: item.article },
    });
    
    if (!currentProduct) {
      throw new NotFoundException('Товар не найден в каталоге');
    }
    
    if (dto.quantity > currentProduct.quantity) {
      throw new BadRequestException(
        `Недостаточно товара на складе. Доступно: ${currentProduct.quantity} шт.`,
      );
    }
  
    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);
  }

  async removeFromCart(userId: number, cartItemId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.id === cartItemId);

    if (!item) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    await this.cartItemRepository.remove(item);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await this.cartItemRepository.remove(cart.items);
  }

  async mergeGuestCart(userId: number, guestCartItems: AddToCartDto[]): Promise<void> {
    for (const item of guestCartItems) {
      await this.addToCart(userId, item);
    }
  }
}