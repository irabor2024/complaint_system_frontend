import { AppError } from '../common/errors/AppError';
import { departmentRepository } from '../repositories/department.repository';
import { cacheService, CacheKeys } from './cache.service';

export class DepartmentService {
  async list() {
    const cached = await cacheService.get<unknown[]>(CacheKeys.departmentsAll);
    if (cached) return cached;

    const rows = await departmentRepository.findAll();
    const dto = rows.map(d => ({
      id: d.id,
      name: d.name,
      head: d.head ?? '',
      description: d.description ?? '',
      staffCount: d.staffCount,
    }));
    await cacheService.set(CacheKeys.departmentsAll, dto);
    return dto;
  }

  async getById(id: string) {
    const d = await departmentRepository.findById(id);
    if (!d) throw new AppError(404, 'DEPARTMENT_NOT_FOUND', 'Department not found');
    return {
      id: d.id,
      name: d.name,
      head: d.head ?? '',
      description: d.description ?? '',
      staffCount: d.staffCount,
    };
  }

  async create(input: { name: string; head?: string; description?: string }) {
    const d = await departmentRepository.create({
      name: input.name.trim(),
      head: input.head?.trim(),
      description: input.description?.trim(),
    });
    await cacheService.del(CacheKeys.departmentsAll);
    return d;
  }

  async update(
    id: string,
    input: { name?: string; head?: string; description?: string; staffCount?: number }
  ) {
    await this.getById(id);
    const d = await departmentRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.head !== undefined ? { head: input.head.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.staffCount !== undefined ? { staffCount: input.staffCount } : {}),
    });
    await cacheService.del(CacheKeys.departmentsAll);
    return d;
  }

  async delete(id: string) {
    await this.getById(id);
    await departmentRepository.delete(id);
    await cacheService.del(CacheKeys.departmentsAll);
  }
}

export const departmentService = new DepartmentService();
