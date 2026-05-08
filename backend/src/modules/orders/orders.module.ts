import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DjangoIntegrationsOrdersController } from './django-integrations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, User, Product]),
    AuthModule,
  ],
  controllers: [OrdersController, DjangoIntegrationsOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}