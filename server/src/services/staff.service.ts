import bcrypt from 'bcryptjs';
import { AppError } from '../common/errors/AppError';
import { userRepository } from '../repositories/user.repository';
import { departmentRepository } from '../repositories/department.repository';
import { complaintRepository } from '../repositories/complaint.repository';
import { emailService } from './email.service';

export class StaffService {
  async list() {
    const users = await userRepository.listByRole('STAFF');
    const withCounts = await Promise.all(
      users.map(async u => {
        const dept = u.departmentId ? await departmentRepository.findById(u.departmentId) : null;
        const counts = await complaintRepository.countForStaff(u.id);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          departmentId: u.departmentId ?? '',
          department: dept?.name ?? '',
          role: u.jobTitle ?? 'Staff',
          assignedComplaints: counts.assigned,
          resolvedComplaints: counts.resolved,
          joinDate: u.createdAt.toISOString().slice(0, 10),
        };
      })
    );
    return withCounts;
  }

  async create(input: {
    name: string;
    email: string;
    password: string;
    departmentId: string;
    jobTitle: string;
  }) {
    const email = input.email.toLowerCase();
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'EMAIL_IN_USE', 'A user with this email already exists');
    }
    const dept = await departmentRepository.findById(input.departmentId);
    if (!dept) {
      throw new AppError(400, 'INVALID_DEPARTMENT', 'Department not found');
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create({
      email,
      passwordHash,
      name: input.name.trim(),
      role: 'STAFF',
      jobTitle: input.jobTitle.trim() || 'Staff',
      department: { connect: { id: dept.id } },
    });
    await departmentRepository.update(dept.id, {
      staffCount: await userRepository.countStaffInDepartment(dept.id),
    });
    await emailService.sendWelcomeStaff(email, user.name);
    const counts = await complaintRepository.countForStaff(user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      departmentId: user.departmentId ?? '',
      department: dept.name,
      role: user.jobTitle ?? 'Staff',
      assignedComplaints: counts.assigned,
      resolvedComplaints: counts.resolved,
      joinDate: user.createdAt.toISOString().slice(0, 10),
    };
  }
}

export const staffService = new StaffService();
