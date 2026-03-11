import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Order } from './entities/order.entity';
  import { OrderItem } from './entities/order-item.entity';
  import { Cart } from '../cart/entities/cart.entity';
  import { CartItem } from '../cart/entities/cart-item.entity';
  import { User } from '../users/entities/user.entity';
  import { CreateOrderDto } from './dto/create-order.dto';
  
  @Injectable()
  export class OrdersService {
    constructor(
      @InjectRepository(Order)
      private ordersRepo: Repository<Order>,
      @InjectRepository(OrderItem)
      private orderItemsRepo: Repository<OrderItem>,
      @InjectRepository(Cart)
      private cartRepo: Repository<Cart>,
      @InjectRepository(CartItem)
      private cartItemsRepo: Repository<CartItem>,
      @InjectRepository(User)
      private usersRepo: Repository<User>,
    ) {}
  
    private async generateReference(): Promise<string> {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const count = await this.ordersRepo.count();
      const seq = String(count + 1).padStart(6, '0');
      return `ORD-${dateStr}-${seq}`;
    }
  
    async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
      const user = await this.usersRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Пользователь не найден');
      if (!user.isActive) {
        throw new ForbiddenException(
          'Оформление заказов доступно только после активации аккаунта',
        );
      }
  
      const cart = await this.cartRepo.findOne({ where: { userId } });
      if (!cart) throw new NotFoundException('Корзина не найдена');
  
      const items = await this.cartItemsRepo
        .createQueryBuilder('ci')
        .where('ci.id IN (:...ids)', { ids: dto.cartItemIds })
        .andWhere('ci.cart_id = :cartId', { cartId: cart.id })
        .getMany();
  
      if (items.length === 0) {
        throw new NotFoundException('Выбранные позиции не найдены в корзине');
      }
  
      const reference = await this.generateReference();
  
      const savedOrder = await this.ordersRepo.save(
        this.ordersRepo.create({ userId, reference, status: null }),
      );
  
      const orderItems = items.map((ci) =>
        this.orderItemsRepo.create({
          orderId: savedOrder.id,
          article: ci.article,
          name: ci.name,
          fullName: ci.fullName,
          marka: ci.marka,
          model: ci.model,
          priceSnapshot: Number(ci.priceSnapshot),
          quantity: ci.quantity,
          discount: null,
          priceAfterDiscount: null,
          status: null,
        }),
      );
  
      await this.orderItemsRepo.save(orderItems);
  
      // Remove the ordered items from the cart
      await this.cartItemsRepo.delete(dto.cartItemIds);
  
      const result = await this.ordersRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['items'],
      });
      if (!result) throw new NotFoundException('Ошибка при создании заказа');
      return result;
    }
  
    async getUserOrders(userId: number): Promise<Order[]> {
      return this.ordersRepo.find({
        where: { userId },
        relations: ['items'],
        order: { createdAt: 'DESC' },
      });
    }
  
    // а) Все необработанные заказы (status IS NULL) — для 1С
    async getUnprocessedOrders(): Promise<object[]> {
      const orders = await this.ordersRepo
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.items', 'items')
        .leftJoinAndSelect('o.user', 'user')
        .where('o.status IS NULL')
        .orderBy('o.createdAt', 'ASC')
        .getMany();
  
      return orders.map((order) => ({
        site_client_id: order.user.id,
        client_number_1c: order.user.clientNumber1c,
        delivery_method: order.user.preferredDelivery,
        order_reference: order.reference,
        order_id: order.id,
        created_at: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          article: item.article,
          name: item.name,
          quantity: item.quantity,
          price: Number(item.priceSnapshot),
          status: item.status,
        })),
      }));
    }
  
    // б) Установить статус заказа целиком
    async updateOrderStatus(orderId: number, status: string): Promise<Order> {
      const order = await this.ordersRepo.findOne({
        where: { id: orderId },
        relations: ['items'],
      });
      if (!order) throw new NotFoundException('Заказ не найден');
      order.status = status;
      return this.ordersRepo.save(order);
    }
  
    // б) Установить статус отдельной позиции заказа
    async updateItemStatus(itemId: number, status: string): Promise<OrderItem> {
      const item = await this.orderItemsRepo.findOne({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Позиция заказа не найдена');
      item.status = status;
      return this.orderItemsRepo.save(item);
    }
  
    // в) Отказ по позиции (брак/не нашли) — статус + обнуление суммы
    async rejectItem(itemId: number, status: string): Promise<OrderItem> {
      const item = await this.orderItemsRepo.findOne({ where: { id: itemId } });
      if (!item) throw new NotFoundException('Позиция заказа не найдена');
      item.status = status;
      item.priceSnapshot = 0;
      item.priceAfterDiscount = 0;
      return this.orderItemsRepo.save(item);
    }
  }