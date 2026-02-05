import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('cross_reference')
@Index(['oem'])
@Index(['article'])
export class CrossReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  article: string;

  @Column({ length: 100 })
  oem: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}