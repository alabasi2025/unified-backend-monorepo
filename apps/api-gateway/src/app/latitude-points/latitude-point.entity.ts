import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

/**
 * يمثل نقطة خط عرض (Latitude) في النظام.
 * يتم استخدام هذا الجدول لتخزين نقاط جغرافية محددة مع بيانات وصفية.
 * يفترض أن يتم ربط هذا الجدول بجداول أخرى (مثل 'locations' أو 'addresses') عبر علاقة One-to-Many.
 */
@Entity('latitude_points')
export class LatitudePoint {
  /**
   * المعرف الأساسي لنقطة خط العرض.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * قيمة خط العرض.
   * يجب أن تكون بين -90 و 90.
   */
  @Column({ type: 'double precision', nullable: false })
  @Index()
  @IsNotEmpty()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  /**
   * قيمة خط الطول المرتبطة بخط العرض.
   * يجب أن تكون بين -180 و 180.
   */
  @Column({ type: 'double precision', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  /**
   * اسم وصفي أو عنوان لنقطة خط العرض.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  /**
   * وصف إضافي لنقطة خط العرض.
   */
  @Column({ type: 'text', nullable: true })
  description: string;

  /**
   * تاريخ ووقت إنشاء السجل.
   */
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * تاريخ ووقت آخر تحديث للسجل.
   */
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // مثال على علاقة: يمكن ربط نقطة خط العرض بالعديد من سجلات المواقع (Locations)
  // @OneToMany(() => Location, (location) => location.latitudePoint)
  // locations: Location[];
}
