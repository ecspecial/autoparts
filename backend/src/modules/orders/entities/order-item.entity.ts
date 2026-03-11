import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Order } from './order.entity';
  
  @Entity('order_items')
  export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'order_id' })
    orderId: number;
  
    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @Column({ length: 50 })
    article: string;
  
    @Column({ type: 'text' })
    name: string;
  
    @Column({ type: 'text', name: 'full_name', nullable: true })
    fullName: string | null;
  
    @Column({ length: 100, nullable: true })
    marka: string | null;
  
    @Column({ length: 100, nullable: true })
    model: string | null;
  
    @Column('decimal', { precision: 10, scale: 2, name: 'price_snapshot' })
    priceSnapshot: number;
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null })
    discount: number | null;
  
    @Column('decimal', {
      precision: 10,
      scale: 2,
      name: 'price_after_discount',
      nullable: true,
      default: null,
    })
    priceAfterDiscount: number | null;
  
    @Column('int')
    quantity: number;
  
    @Column({ type: 'varchar', length: 100, nullable: true, default: null })
    status: string | null;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }