import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  // Dummy data - في الإنتاج يجب استخدام Prisma
  private users = [
    { id: 1, username: 'admin', email: 'admin@semop.com', firstName: 'مدير', lastName: 'النظام', isActive: true, roleId: 1 },
    { id: 2, username: 'user1', email: 'user1@semop.com', firstName: 'محمد', lastName: 'أحمد', isActive: true, roleId: 2 },
    { id: 3, username: 'user2', email: 'user2@semop.com', firstName: 'فاطمة', lastName: 'علي', isActive: true, roleId: 2 },
    { id: 4, username: 'user3', email: 'user3@semop.com', firstName: 'سارة', lastName: 'خالد', isActive: false, roleId: 3 },
    { id: 5, username: 'user4', email: 'user4@semop.com', firstName: 'عمر', lastName: 'يوسف', isActive: true, roleId: 3 }
  ];

  private nextId = 6;

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  create(createUserDto: any) {
    const newUser = {
      id: this.nextId++,
      ...createUserDto,
      isActive: true
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: any) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users.splice(userIndex, 1);
    return { message: 'User deleted successfully' };
  }
}
