import { Injectable } from '@nestjs/common';
@Injectable()
export class ArchiveService {
  async create(createDto: any) { return { id: 'arc-' + Date.now(), ...createDto }; }
  async findAll() { return []; }
  async findOne(id: string) { return { id }; }
  async restore(id: string) { return { id, restored: true }; }
  async remove(id: string) { return { id }; }
}
