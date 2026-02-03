import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { Cart } from './cart.entity';
  
  @Entity('cart_items')
  export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'cart_id' })
    cartId: number;
  
    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;
  
    @Column({ length: 50 })
    article: string; // Stable SKU identifier
  
    @Column({ type: 'text' })
    name: string; // Product name snapshot
  
    @Column({ type: 'text', name: 'full_name' })
    fullName: string; // Full name snapshot
  
    @Column({ length: 100 })
    marka: string; // Brand snapshot
  
    @Column({ length: 100 })
    model: string; // Model snapshot
  
    @Column('decimal', { precision: 10, scale: 2, name: 'price_snapshot' })
    priceSnapshot: number; // Price when added to cart
  
    @Column('int')
    quantity: number;
  
    @CreateDateColumn({ name: 'added_at' })
    addedAt: Date;
  }