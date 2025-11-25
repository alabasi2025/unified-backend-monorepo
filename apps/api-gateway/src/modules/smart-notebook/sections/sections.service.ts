import { Injectable } from '@nestjs/common';
@Injectable()
export class SectionsService {
  async create(createDto: any) { return { id: 'sec-' + Date.now(), ...createDto }; }
  async findAll() { return []; }
  async findOne(id: string) { return { id }; }
  async update(id: string, updateDto: any) { return { id, ...updateDto }; }
  async remove(id: string) { return { id }; }
}
