import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { CartItem } from './cart-item.entity';
  
  @Entity('carts')
  export class Cart {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ name: 'user_id' })
    userId: number;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
    items: CartItem[];  // ← TypeScript should recognize CartItem type now
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }