import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity'; // افتراض وجود جدول المنتجات

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  name: string; // اسم الوحدة (مثل: قطعة، كجم، لتر)

  @Column({ length: 10 })
  symbol: string; // رمز الوحدة (مثل: pc, kg, L)

  @Column({ default: true })
  isActive: boolean; // حالة التفعيل

  @Column({ nullable: true, type: 'text' })
  description: string; // وصف إضافي

  // علاقة One-to-Many مع جدول المنتجات (افتراض أن المنتج له وحدة قياس أساسية)
  @OneToMany(() => Product, (product) => product.unit)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date;
}
