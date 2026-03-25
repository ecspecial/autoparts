import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  article: string;

  /** Внутренний код из прайса (колонка artKod в CSV); для отображения и новинок */
  @Column({ type: 'varchar', length: 120, nullable: true })
  artKod: string | null;

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

  @Column({ length: 150, nullable: true })
  type: string;

  @Column({ length: 200, nullable: true })
  lab: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
