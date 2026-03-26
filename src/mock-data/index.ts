import { Complaint, StaffMember, Notification, ComplaintCategory, Department, ComplaintStatus, Priority } from '@/types';

const categories: ComplaintCategory[] = ['Hygiene', 'Billing', 'Staff Behavior', 'Service Delay', 'Equipment', 'Other'];
const departments: Department[] = ['Emergency', 'Billing', 'Pharmacy', 'Laboratory', 'Ward', 'Administration'];
const statuses: ComplaintStatus[] = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'];
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'William', 'Amanda', 'James', 'Sophia', 'Daniel', 'Olivia', 'Matthew', 'Isabella', 'Andrew', 'Mia', 'Christopher', 'Charlotte'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const descriptions: Record<ComplaintCategory, string[]> = {
  'Hygiene': [
    'The restroom on the 3rd floor was not cleaned properly. There were dirty towels on the floor.',
    'Found unclean bedsheets in Room 205. The housekeeping team needs to be more thorough.',
    'The waiting area had overflowing trash cans and sticky floors.',
    'Hand sanitizer dispensers in the ICU wing have been empty for two days.',
  ],
  'Billing': [
    'I was charged twice for the same blood test. The billing department has not responded to my queries.',
    'My insurance was not applied correctly to the final bill. I need a revised statement.',
    'Received an unexpected charge of $500 for a consultation that was supposed to be covered.',
    'The billing counter staff could not explain the charges on my invoice.',
  ],
  'Staff Behavior': [
    'The nurse at the reception was very rude when I asked about my appointment time.',
    'A staff member in the pharmacy was dismissive and unhelpful when I asked about medication side effects.',
    'The attending physician did not listen to my concerns and rushed through the consultation.',
    'Security guard at the entrance was unnecessarily aggressive with elderly patients.',
  ],
  'Service Delay': [
    'Waited over 3 hours in the emergency room before being seen by a doctor.',
    'My lab results were supposed to be ready in 2 hours but took over 8 hours.',
    'The scheduled surgery was delayed by 4 hours without any communication or explanation.',
    'Pharmacy took 2 hours to fill a simple prescription.',
  ],
  'Equipment': [
    'The blood pressure monitor in Room 302 is giving inaccurate readings.',
    'The elevator on the east wing has been out of service for a week causing difficulties for patients.',
    'The IV pump in the ICU ward is malfunctioning and beeping constantly.',
    'Wheelchair availability is very limited. Had to wait 45 minutes for one.',
  ],
  'Other': [
    'The parking lot is always full and there are no clear directions to overflow parking.',
    'The cafeteria food quality has significantly declined over the past month.',
    'Wi-Fi in the patient rooms is extremely slow and unreliable.',
    'The hospital signage is confusing and I got lost multiple times trying to find the lab.',
  ],
};

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(Math.floor(Math.random() * 12) + 7, Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const staffMembers: StaffMember[] = [
  { id: 's1', name: 'Dr. Sarah Chen', email: 'sarah.chen@hospital.com', department: 'Emergency', role: 'staff', assignedComplaints: 8, resolvedComplaints: 5 },
  { id: 's2', name: 'James Wilson', email: 'james.wilson@hospital.com', department: 'Billing', role: 'staff', assignedComplaints: 12, resolvedComplaints: 9 },
  { id: 's3', name: 'Maria Garcia', email: 'maria.garcia@hospital.com', department: 'Pharmacy', role: 'staff', assignedComplaints: 6, resolvedComplaints: 4 },
  { id: 's4', name: 'Dr. Robert Kim', email: 'robert.kim@hospital.com', department: 'Laboratory', role: 'staff', assignedComplaints: 5, resolvedComplaints: 3 },
  { id: 's5', name: 'Emily Davis', email: 'emily.davis@hospital.com', department: 'Ward', role: 'staff', assignedComplaints: 10, resolvedComplaints: 7 },
  { id: 's6', name: 'Thomas Brown', email: 'thomas.brown@hospital.com', department: 'Administration', role: 'admin', assignedComplaints: 3, resolvedComplaints: 2 },
  { id: 's7', name: 'Dr. Lisa Patel', email: 'lisa.patel@hospital.com', department: 'Emergency', role: 'staff', assignedComplaints: 7, resolvedComplaints: 6 },
  { id: 's8', name: 'Michael Torres', email: 'michael.torres@hospital.com', department: 'Billing', role: 'staff', assignedComplaints: 9, resolvedComplaints: 7 },
  { id: 's9', name: 'Jennifer Lee', email: 'jennifer.lee@hospital.com', department: 'Ward', role: 'staff', assignedComplaints: 4, resolvedComplaints: 2 },
  { id: 's10', name: 'Dr. Ahmed Hassan', email: 'ahmed.hassan@hospital.com', department: 'Laboratory', role: 'staff', assignedComplaints: 6, resolvedComplaints: 5 },
];

function generateComplaints(): Complaint[] {
  const complaints: Complaint[] = [];
  for (let i = 0; i < 55; i++) {
    const category = randomItem(categories);
    const department = randomItem(departments);
    const status = randomItem(statuses);
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = generateDate(daysAgo);
    const staff = randomItem(staffMembers);
    const ticketNum = String(i + 1).padStart(4, '0');

    const complaint: Complaint = {
      id: `c${i + 1}`,
      ticketId: `CMP-2026-${ticketNum}`,
      patientName: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      email: `patient${i + 1}@email.com`,
      phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      category,
      department,
      description: randomItem(descriptions[category]),
      status,
      priority: randomItem(priorities),
      assignedStaffId: status !== 'Submitted' ? staff.id : undefined,
      assignedStaffName: status !== 'Submitted' ? staff.name : undefined,
      createdAt,
      updatedAt: status === 'Submitted' ? createdAt : generateDate(Math.max(0, daysAgo - Math.floor(Math.random() * 5))),
      responses: status !== 'Submitted' ? [
        {
          id: `r${i}-1`,
          complaintId: `c${i + 1}`,
          responderId: staff.id,
          responderName: staff.name,
          responderRole: 'staff',
          message: `Thank you for bringing this to our attention. We are looking into your ${category.toLowerCase()} complaint regarding the ${department} department.`,
          createdAt: generateDate(Math.max(0, daysAgo - 1)),
          statusChange: 'Under Review',
        },
      ] : [],
    };

    if (status === 'Resolved' || status === 'Closed') {
      complaint.responses.push({
        id: `r${i}-2`,
        complaintId: `c${i + 1}`,
        responderId: staff.id,
        responderName: staff.name,
        responderRole: 'staff',
        message: 'This issue has been addressed. We have taken corrective measures to prevent this from happening again. Please feel free to reach out if you have any further concerns.',
        createdAt: generateDate(Math.max(0, daysAgo - 3)),
        statusChange: 'Resolved',
      });
    }

    complaints.push(complaint);
  }
  return complaints;
}

export const complaints: Complaint[] = generateComplaints();

export const notifications: Notification[] = [
  { id: 'n1', type: 'new_complaint', title: 'New Complaint Received', message: 'A new complaint CMP-2026-0055 has been submitted regarding Hygiene in Emergency.', read: false, createdAt: generateDate(0), complaintId: 'c55' },
  { id: 'n2', type: 'assignment', title: 'Complaint Assigned', message: 'Complaint CMP-2026-0050 has been assigned to you.', read: false, createdAt: generateDate(0), complaintId: 'c50' },
  { id: 'n3', type: 'resolution', title: 'Complaint Resolved', message: 'Complaint CMP-2026-0030 has been marked as resolved.', read: true, createdAt: generateDate(1), complaintId: 'c30' },
  { id: 'n4', type: 'response', title: 'New Response', message: 'A new response has been added to complaint CMP-2026-0020.', read: true, createdAt: generateDate(1), complaintId: 'c20' },
  { id: 'n5', type: 'new_complaint', title: 'New Complaint Received', message: 'A new complaint CMP-2026-0054 about Billing has been submitted.', read: true, createdAt: generateDate(2), complaintId: 'c54' },
  { id: 'n6', type: 'assignment', title: 'Complaint Assigned', message: 'Complaint CMP-2026-0045 has been assigned to Dr. Sarah Chen.', read: true, createdAt: generateDate(2), complaintId: 'c45' },
  { id: 'n7', type: 'resolution', title: 'Complaint Resolved', message: 'Complaint CMP-2026-0025 in Pharmacy has been closed.', read: true, createdAt: generateDate(3), complaintId: 'c25' },
  { id: 'n8', type: 'response', title: 'Patient Follow-up', message: 'Patient has responded to complaint CMP-2026-0015.', read: true, createdAt: generateDate(4), complaintId: 'c15' },
];

// Monthly trend data for charts
export const monthlyTrend = [
  { month: 'Sep', complaints: 28, resolved: 22 },
  { month: 'Oct', complaints: 35, resolved: 28 },
  { month: 'Nov', complaints: 42, resolved: 35 },
  { month: 'Dec', complaints: 38, resolved: 30 },
  { month: 'Jan', complaints: 45, resolved: 38 },
  { month: 'Feb', complaints: 50, resolved: 42 },
  { month: 'Mar', complaints: 55, resolved: 40 },
];

export const categoryData = categories.map(cat => ({
  name: cat,
  value: complaints.filter(c => c.category === cat).length,
}));

export const departmentData = departments.map(dep => ({
  name: dep,
  complaints: complaints.filter(c => c.department === dep).length,
  resolved: complaints.filter(c => c.department === dep && (c.status === 'Resolved' || c.status === 'Closed')).length,
}));

export const resolutionTimeData = [
  { range: '<24h', count: 8 },
  { range: '1-3 days', count: 15 },
  { range: '3-7 days', count: 12 },
  { range: '1-2 weeks', count: 7 },
  { range: '>2 weeks', count: 3 },
];
