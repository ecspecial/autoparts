import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { OrderItem } from './order-item.entity';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'user_id' })
    userId: number;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @Column({ unique: true, length: 50 })
    reference: string;
  
    @Column({ type: 'varchar', length: 100, nullable: true, default: null })
    status: string | null;

    @Column({ type: 'varchar', name: 'order_source', length: 50, nullable: true, default: null })
    orderSource: string | null; // "site" — с сайта, "API" — через Django bridge

    /** Город склада/сайта откуда поступил заказ: 'ekb' | 'spb' */
    @Column({ type: 'varchar', length: 20, nullable: true, default: null })
    city: string | null;
  
    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }