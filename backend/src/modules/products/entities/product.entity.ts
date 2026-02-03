import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
//                                                  ^^^^^^^^^^^^^^^^ (fix this)

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  article: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @Column({ length: 100 })
  brand: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ length: 100 })
  marka: string;

  @Column({ length: 100 })
  model: string;

  @Column({ length: 150 })
  generation: string;

  @Column({ type: 'text', nullable: true })
  ozonUrl: string;

  @Column({ type: 'text', nullable: true })
  wildberriesUrl: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ length: 100, nullable: true })
  oem: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()  // ← Fixed from UpdateColumn
  updatedAt: Date;
}