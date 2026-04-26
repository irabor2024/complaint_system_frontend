import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);

  await prisma.notification.deleteMany();
  await prisma.complaintResponse.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const departments = [
    {
      id: 'dept-1',
      name: 'Emergency',
      head: 'Dr. Sarah Chen',
      description: 'Emergency and urgent care services',
      staffCount: 1,
    },
    {
      id: 'dept-2',
      name: 'Cardiology',
      head: 'Dr. James Wilson',
      description: 'Heart and cardiovascular services',
      staffCount: 0,
    },
    {
      id: 'dept-3',
      name: 'Orthopedics',
      head: 'Dr. Emily Rodriguez',
      description: 'Bone and joint care',
      staffCount: 0,
    },
    {
      id: 'dept-4',
      name: 'Pediatrics',
      head: 'Dr. Michael Park',
      description: 'Children healthcare services',
      staffCount: 0,
    },
    {
      id: 'dept-5',
      name: 'Radiology',
      head: 'Dr. Lisa Thompson',
      description: 'Imaging and diagnostic services',
      staffCount: 0,
    },
    {
      id: 'dept-6',
      name: 'General Medicine',
      head: 'Dr. Robert Kumar',
      description: 'General health and wellness',
      staffCount: 0,
    },
  ];

  for (const d of departments) {
    await prisma.department.create({ data: d });
  }

  await prisma.user.create({
    data: {
      email: 'admin@hospital.com',
      passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      email: 'staff@hospital.com',
      passwordHash,
      name: 'Dr. Sarah Chen',
      role: 'STAFF',
      departmentId: 'dept-1',
      jobTitle: 'Physician',
    },
  });

  await prisma.user.create({
    data: {
      email: 'patient@hospital.com',
      passwordHash,
      name: 'John Patient',
      role: 'PATIENT',
    },
  });

  console.log('Seed complete. Demo password for all accounts: ChangeMe123!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
