/**
 * PHASE 10: Organizational Structure Development
 * Position Entity - represents job positions/titles
 */

export class Position {
  id: string;
  code: string;
  titleAr: string;
  titleEn: string;
  description?: string;
  level: number; // 1 = Executive, 2 = Manager, 3 = Staff, etc.
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
