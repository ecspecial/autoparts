import {
    Injectable,
    Logger,
    NotFoundException,
    ForbiddenException,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { InjectDataSource } from '@nestjs/typeorm';
  import { Repository, DataSource } from 'typeorm';
  import { Order } from './entities/order.entity';
  import { OrderItem } from './entities/order-item.entity';
  import { Cart } from '../cart/entities/cart.entity';
  import { CartItem } from '../cart/entities/cart-item.entity';
  import { User } from '../users/entities/user.entity';
  import { Product } from '../products/entities/product.entity';
  import { CreateOrderDto } from './dto/create-order.dto';
  import type { DjangoBridgeOrderLineDto } from './dto/django-integration.dto';
import { MailService } from '../auth/mail.service';
import { UsersService } from '../users/users.service';
  
  @Injectable()
  export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

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
      @InjectRepository(Product)
      private productsRepo: Repository<Product>,
      @InjectDataSource()
      private readonly dataSource: DataSource,
      private mailService: MailService,
      private usersService: UsersService,
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
  
      const siteCity = (process.env.SITE_CITY ?? 'ekb').toLowerCase().trim();
      const savedOrder = await this.ordersRepo.save(
        this.ordersRepo.create({ userId, reference, status: null, orderSource: 'site', city: siteCity }),
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

      void this.mailService
        .notifyNewSiteOrder({
          orderId: result.id,
          reference: result.reference,
          fullName: user.fullName,
          email: user.email ?? '',
          phone: user.phone,
          clientNumber1c: user.clientNumber1c,
          items: result.items.map((i) => ({
            article: i.article,
            name: i.name,
            quantity: i.quantity,
            price: Number(i.priceSnapshot),
          })),
        })
        .catch((err) =>
          this.logger.warn(`Уведомление о заказе не отправлено: ${(err as Error).message}`),
        );

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
        full_name: order.user.fullName || null,
        phone: order.user.phone || null,
        order_source: order.orderSource || null,
        city: order.city || null,
        delivery_method: order.user.preferredDelivery,
        delivery_address: order.user.deliveryAddress || null,
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

    // Все заказы — для админа/1С
    async getAllOrders(): Promise<object[]> {
        const orders = await this.ordersRepo
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.items', 'items')
        .leftJoinAndSelect('o.user', 'user')
        .orderBy('o.createdAt', 'DESC')
        .getMany();
        return orders.map((order) => ({
        site_client_id: order.user.id,
        client_number_1c: order.user.clientNumber1c,
        order_source: order.orderSource || null,
        city: order.city || null,
        delivery_method: order.user.preferredDelivery,
        delivery_address: order.user.deliveryAddress || null,
        order_reference: order.reference,
        order_id: order.id,
        order_status: order.status,
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

    // Для админа/1С (без проверки владельца)
    async getOrderById(orderId: number): Promise<object> {
        const order = await this.ordersRepo.findOne({
          where: { id: orderId },
          relations: ['items', 'user'],
        });
        if (!order) throw new NotFoundException('Заказ не найден');
        return {
          site_client_id: order.user.id,
          client_number_1c: order.user.clientNumber1c,
          full_name: order.user.fullName || null,
          phone: order.user.phone || null,
          order_source: order.orderSource || null,
          delivery_method: order.user.preferredDelivery,
          delivery_address: order.user.deliveryAddress || null,
          order_reference: order.reference,
          order_id: order.id,
          order_status: order.status,
          created_at: order.createdAt,
          items: order.items.map((item) => ({
            id: item.id,
            article: item.article,
            name: item.name,
            quantity: item.quantity,
            price: Number(item.priceSnapshot),
            discount: item.discount,
            price_after_discount: item.priceAfterDiscount,
            status: item.status,
          })),
        };
    }

    // Обновление скидки и итоговой цены по позиции
    async updateItemDiscount(
      orderId: number,
      itemId: number,
      discount: number,
      priceAfterDiscount: number,
    ): Promise<OrderItem> {
      const item = await this.orderItemsRepo.findOne({
        where: { id: itemId, orderId },
      });
      if (!item) throw new NotFoundException('Позиция заказа не найдена');
      item.discount = discount;
      item.priceAfterDiscount = priceAfterDiscount;
      return this.orderItemsRepo.save(item);
    }

    /** Пользователь партнёрского API: partner_legacy_login, email или код 1С. */
    private djangoBridgeAutoProvisionEnabled(): boolean {
      const v = (process.env.DJANGO_BRIDGE_AUTO_PROVISION ?? 'true').toLowerCase();
      return !['0', 'false', 'no'].includes(v);
    }

    private normalizePartnerLineQty(line: DjangoBridgeOrderLineDto): number {
      const raw = line.quantity ?? line.qty;
      if (raw === undefined || raw === null || raw === '') {
        return NaN;
      }
      const n = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw);
      return Number.isFinite(n) ? n : NaN;
    }

    private async findCatalogProductByArticle(
      rawArticle: string,
      city?: string | null,
    ): Promise<Product | null> {
      const t = String(rawArticle ?? '').trim();
      if (!t) return null;

      const cityFilter = city?.trim().toLowerCase() || undefined;

      let p = await this.productsRepo.findOne({
        where: { article: t, ...(cityFilter ? { city: cityFilter } : {}) },
      });
      if (p) return p;

      const noDash = t.replace(/-/g, '');
      if (noDash && noDash !== t) {
        p = await this.productsRepo.findOne({
          where: { article: noDash, ...(cityFilter ? { city: cityFilter } : {}) },
        });
        if (p) return p;
      }
      return null;
    }

    private legacyItemStatusLabel(status: string | null): string {
      if (status === '1') return 'В наличии';
      if (status === '6') return 'Нет в наличии';
      return status ?? '';
    }

    /**
     * Создание заказа из legacy Django (после проверки login/password в Django).
     * order_source = API.
     */
    async createOrderFromDjangoBridge(params: {
      partnerLogin: string;
      lines: DjangoBridgeOrderLineDto[];
      legacyUserId?: number;
      legacyDiscount?: number;
      legacyCity?: string;
    }): Promise<number> {
      const { partnerLogin, lines, legacyUserId, legacyDiscount, legacyCity } = params;

      let user = await this.usersService.findForDjangoBridgePartner(
        partnerLogin,
        legacyUserId,
      );

      if (!user && this.djangoBridgeAutoProvisionEnabled()) {
        user = await this.usersService.provisionPartnerFromDjangoBridge({
          partnerLogin,
          legacyUserId,
          legacyDiscount,
        });
      }

      if (!user) {
        throw new HttpException(
          { code: '1003', message: 'Указан не правильный пользователь ' },
          HttpStatus.NOT_FOUND,
        );
      }
      if (!user.isActive) {
        throw new HttpException(
          { code: '1003', message: 'Аккаунт не активирован' },
          HttpStatus.NOT_FOUND,
        );
      }

      const parsed: Array<{
        product: Product;
        quantity: number;
        ncRef: string | null;
        ncComent: string | null;
      }> = [];

      for (const line of lines) {
        const quantity = this.normalizePartnerLineQty(line);
        if (!Number.isFinite(quantity) || quantity < 1) {
          throw new HttpException(
            { code: '6000', message: 'Артикул не найден' },
            HttpStatus.NOT_FOUND,
          );
        }

        const product = await this.findCatalogProductByArticle(line.article, legacyCity);
        if (!product) {
          throw new HttpException(
            { code: '6000', message: 'Артикул не найден' },
            HttpStatus.NOT_FOUND,
          );
        }

        parsed.push({
          product,
          quantity,
          ncRef: line.nc_ref?.trim() ? line.nc_ref.trim() : null,
          ncComent: line.nc_coment?.trim() ? line.nc_coment.trim() : null,
        });
      }

      const disPct = Number(user.discount ?? 0);

      const allOos =
        parsed.length > 0 && parsed.every((x) => Number(x.product.quantity ?? 0) <= 0);
      const orderAggregateStatus = allOos ? '6' : null;

      const reference = await this.generateReference();

      const orderId = await this.dataSource.transaction(async (manager) => {
        const orderRepo = manager.getRepository(Order);
        const orderItemRepo = manager.getRepository(OrderItem);

        const orderCity = legacyCity?.trim().toLowerCase() || null;
        const order = await orderRepo.save(
          orderRepo.create({
            userId: user.id,
            reference,
            status: orderAggregateStatus,
            orderSource: 'API',
            city: orderCity,
          }),
        );

        const orderItems = parsed.map(({ product, quantity, ncRef, ncComent }) => {
          const base = Number(product.price);
          const priceSnapshot =
            Math.round(base * (100 - disPct) * 100) / 100;
          const inStock = Number(product.quantity ?? 0) > 0;
          const rowStatus = inStock ? '1' : '6';

          return orderItemRepo.create({
            orderId: order.id,
            article: String(product.article).trim(),
            name: product.name,
            fullName: product.fullName,
            marka: product.marka,
            model: product.model,
            priceSnapshot,
            quantity,
            discount: null,
            priceAfterDiscount: null,
            status: rowStatus,
            ncRef,
            ncComent,
          });
        });

        await orderItemRepo.save(orderItems);

        return order.id;
      });

      const result = await this.ordersRepo.findOne({
        where: { id: orderId },
        relations: ['items'],
      });
      if (!result?.items?.length) {
        throw new NotFoundException('Ошибка при создании заказа');
      }

      void this.mailService
        .notifyNewSiteOrder({
          orderId: result.id,
          reference: result.reference,
          fullName: user.fullName,
          email: user.email ?? '',
          phone: user.phone,
          clientNumber1c: user.clientNumber1c,
          orderSource: 'API',
          items: result.items.map((i) => ({
            article: i.article,
            name: i.name,
            quantity: i.quantity,
            price: Number(i.priceSnapshot),
          })),
        })
        .catch((err) =>
          this.logger.warn(
            `Уведомление о заказе не отправлено: ${(err as Error).message}`,
          ),
        );

      return orderId;
    }

    /**
     * Детали заказа для legacy order-details / get_order_details_m.
     */
    async getPartnerOrderDetailsForLegacy(
      partnerLogin: string,
      orderId: number,
      variant: 'classic' | 'market',
      legacyUserId?: number,
    ): Promise<Record<string, unknown>> {
      const user = await this.usersService.findForDjangoBridgePartner(
        partnerLogin,
        legacyUserId,
      );
      if (!user) {
        throw new HttpException(
          { code: '1003', message: 'Указан не правильный пользователь ' },
          HttpStatus.NOT_FOUND,
        );
      }

      const order = await this.ordersRepo.findOne({
        where: { id: orderId, userId: user.id },
        relations: ['items'],
      });

      if (!order || !order.items?.length) {
        throw new HttpException(
          { code: '5021', message: 'Заказ не найден.' },
          HttpStatus.NOT_FOUND,
        );
      }

      const itemsOut: Record<string, unknown>[] = [];

      for (const item of order.items) {
        const product = await this.findCatalogProductByArticle(item.article);
        const brand = product?.brand ?? item.marka ?? '';

        const statusNum = Number.parseInt(String(item.status ?? '0'), 10);

        if (variant === 'market') {
          itemsOut.push({
            count_need: item.quantity,
            status: statusNum,
            t2_manufacturer: brand,
            t2_article_show: item.article,
            t2_name: item.name,
            nc_ref: item.ncRef ?? '',
            nc_coment: item.ncComent ?? '',
          });
        } else {
          itemsOut.push({
            count_need: item.quantity,
            status: statusNum,
            name_status: this.legacyItemStatusLabel(item.status),
            t2_manufacturer: brand,
            t2_article_show: item.article,
            t2_name: item.name,
          });
        }
      }

      return {
        message: 'Данные заказа',
        order_id: orderId,
        order_items: itemsOut,
      };
    }
  }