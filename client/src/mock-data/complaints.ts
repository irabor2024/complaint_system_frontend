import { Complaint, Category, ComplaintStatus, Priority } from '@/types';

const categories: Category[] = ['billing', 'treatment', 'staff-behavior', 'facilities', 'wait-time', 'other'];
const statuses: ComplaintStatus[] = ['submitted', 'in-progress', 'under-review', 'resolved', 'closed'];
const priorities: Priority[] = ['low', 'medium', 'high'];
const deptMap = [
  { id: 'dept-1', name: 'Emergency' },
  { id: 'dept-2', name: 'Cardiology' },
  { id: 'dept-3', name: 'Orthopedics' },
  { id: 'dept-4', name: 'Pediatrics' },
  { id: 'dept-5', name: 'Radiology' },
  { id: 'dept-6', name: 'General Medicine' },
];

const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'David', 'Sarah', 'Michael', 'Emily', 'Carlos', 'Aisha', 'Wei', 'Fatima', 'James', 'Sophia', 'Ahmed', 'Yuki', 'Daniel', 'Isabella', 'Omar', 'Hannah'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lee', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'White', 'Harris'];

const descriptions: Record<Category, string[]> = {
  billing: [
    'I was charged twice for the same procedure. Please review my billing statement.',
    'Insurance claim was denied despite pre-authorization. Need immediate resolution.',
    'Received a bill for services I did not receive during my last visit.',
  ],
  treatment: [
    'The prescribed medication caused severe side effects that were not explained.',
    'My treatment plan was not followed properly during my hospital stay.',
    'I was given incorrect medication during my outpatient visit.',
  ],
  'staff-behavior': [
    'The attending nurse was dismissive and rude during my consultation.',
    'Staff at the reception desk were unhelpful and provided wrong directions.',
    'Doctor did not spend adequate time explaining my diagnosis.',
  ],
  facilities: [
    'The waiting area was overcrowded and unsanitary.',
    'The restrooms in the outpatient wing were not clean.',
    'Temperature in the patient rooms was extremely uncomfortable.',
  ],
  'wait-time': [
    'Waited over 4 hours in the emergency department before being seen.',
    'My scheduled appointment was delayed by 2 hours without any notification.',
    'Lab results took 5 days instead of the promised 24 hours.',
  ],
  other: [
    'Lost personal belongings during my hospital stay.',
    'Could not access my medical records through the patient portal.',
    'Parking facility was full and caused me to miss my appointment.',
  ],
};

const staffAssignments = [
  { id: 'staff-1', name: 'Dr. Sarah Chen' },
  { id: 'staff-2', name: 'Nurse James Miller' },
  { id: 'staff-5', name: 'Dr. James Wilson' },
  { id: 'staff-8', name: 'Dr. Emily Rodriguez' },
  { id: 'staff-10', name: 'Dr. Michael Park' },
  { id: 'staff-12', name: 'Dr. Lisa Thompson' },
  { id: 'staff-14', name: 'Dr. Robert Kumar' },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

function buildTimeline(status: ComplaintStatus, createdAt: string) {
  const timeline = [{ date: createdAt, status: 'submitted' as ComplaintStatus, note: 'Complaint submitted successfully', by: 'System' }];
  const idx = statuses.indexOf(status);
  if (idx >= 1) timeline.push({ date: generateDate(Math.floor(Math.random() * 5) + 1), status: 'in-progress', note: 'Complaint assigned to staff', by: 'System' });
  if (idx >= 2) timeline.push({ date: generateDate(Math.floor(Math.random() * 3)), status: 'under-review', note: 'Under review by department head', by: 'Staff' });
  if (idx >= 3) timeline.push({ date: generateDate(Math.floor(Math.random() * 2)), status: 'resolved', note: 'Issue resolved and patient notified', by: 'Staff' });
  if (idx >= 4) timeline.push({ date: generateDate(0), status: 'closed', note: 'Complaint closed after patient confirmation', by: 'System' });
  return timeline;
}

export const complaints: Complaint[] = Array.from({ length: 100 }, (_, i) => {
  const category = randomItem(categories);
  const dept = randomItem(deptMap);
  const status = randomItem(statuses);
  const priority = randomItem(priorities);
  const staff = randomItem(staffAssignments);
  const daysAgo = Math.floor(Math.random() * 60) + 1;
  const createdAt = generateDate(daysAgo);
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);

  return {
    id: `complaint-${i + 1}`,
    ticketId: `TKT-${String(1000 + i).padStart(4, '0')}`,
    patientName: `${firstName} ${lastName}`,
    patientEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    patientPhone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    category,
    department: dept.name,
    departmentId: dept.id,
    priority,
    status,
    description: randomItem(descriptions[category]),
    assignedStaffId: status !== 'submitted' ? staff.id : undefined,
    assignedStaffName: status !== 'submitted' ? staff.name : undefined,
    createdAt,
    updatedAt: generateDate(Math.max(daysAgo - 3, 0)),
    slaDeadline: generateDate(daysAgo - 7),
    timeline: buildTimeline(status, createdAt),
    responses: status === 'submitted' ? [] : [
      { id: `resp-${i}-1`, by: staff.name, role: 'staff', message: 'We are looking into your complaint and will update you shortly.', date: generateDate(daysAgo - 1) },
    ],
  };
});
