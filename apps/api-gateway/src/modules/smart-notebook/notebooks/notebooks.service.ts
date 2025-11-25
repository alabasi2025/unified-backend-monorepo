import { Injectable } from '@nestjs/common';

@Injectable()
export class NotebooksService {
  async create(createDto: any) {
    return { id: 'nb-' + Date.now(), ...createDto };
  }

  async findAll() {
    return [];
  }

  async findOne(id: string) {
    return { id, title: 'Sample Notebook' };
  }

  async update(id: string, updateDto: any) {
    return { id, ...updateDto };
  }

  async remove(id: string) {
    return { id };
  }
}
