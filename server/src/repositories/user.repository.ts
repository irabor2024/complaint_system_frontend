import type { Prisma, Role, User } from '@prisma/client';
import { prisma } from '../infrastructure/prisma';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async listByRole(role: Role): Promise<User[]> {
    return prisma.user.findMany({ where: { role }, orderBy: { name: 'asc' } });
  }

  async countStaffInDepartment(departmentId: string): Promise<number> {
    return prisma.user.count({
      where: { departmentId, role: 'STAFF' },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}

export const userRepository = new UserRepository();
