import { Injectable } from '@nestjs/common';
@Injectable()
export class LinksService {
  async create(createDto: any) { return { id: 'link-' + Date.now(), ...createDto }; }
  async findAll() { return []; }
  async findOne(id: string) { return { id }; }
  async remove(id: string) { return { id }; }
}
