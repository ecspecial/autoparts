import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    login: string;
  
    @Column({ name: 'password_hash' })
    passwordHash: string;
  
    @Column({ type: 'integer', default: 0 })
    discount: number;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }