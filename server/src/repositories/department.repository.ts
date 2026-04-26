import type { Department, Prisma } from '@prisma/client';
import { prisma } from '../infrastructure/prisma';

export class DepartmentRepository {
  async findAll(): Promise<Department[]> {
    return prisma.department.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({ where: { id } });
  }

  async create(data: Prisma.DepartmentCreateInput): Promise<Department> {
    return prisma.department.create({ data });
  }

  async update(id: string, data: Prisma.DepartmentUpdateInput): Promise<Department> {
    return prisma.department.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.department.delete({ where: { id } });
  }
}

export const departmentRepository = new DepartmentRepository();
