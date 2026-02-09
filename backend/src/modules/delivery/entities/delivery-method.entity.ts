import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('delivery_methods')
export class DeliveryMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'code1c', length: 50 })
  code1c: string;

  @Column({ length: 200 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}