import { useState } from 'react';
import { staffMembers as initialStaff } from '@/mock-data/staff';
import { departments } from '@/mock-data/departments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedPage from '@/components/AnimatedPage';
import type { StaffMember } from '@/types';

const emptyForm = { name: '', email: '', departmentId: '', role: 'Nurse' };

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>(() => [...initialStaff]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openAddStaff = () => {
    setForm({ ...emptyForm, departmentId: departments[0]?.id ?? '' });
    setDialogOpen(true);
  };

  const handleAddStaff = () => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name) {
      toast.error('Please enter a name');
      return;
    }
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    if (!form.departmentId) {
      toast.error('Please select a department');
      return;
    }
    const role = form.role.trim() || 'Staff';
    if (staff.some(s => s.email.toLowerCase() === email)) {
      toast.error('A staff member with this email already exists');
      return;
    }
    const dept = departments.find(d => d.id === form.departmentId);
    if (!dept) {
      toast.error('Invalid department');
      return;
    }
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name,
      email,
      departmentId: dept.id,
      department: dept.name,
      role,
      assignedComplaints: 0,
      resolvedComplaints: 0,
      joinDate: new Date().toISOString().slice(0, 10),
    };
    setStaff(prev => [...prev, newMember]);
    toast.success('Staff member added');
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const filtered = staff.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && s.departmentId !== deptFilter) return false;
    return true;
  });

  return (
    <AnimatedPage><div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage hospital staff members</p>
        </div>
        <Button className="rounded-xl gap-2 shrink-0 w-full sm:w-auto" size="sm" onClick={openAddStaff}>
          <Plus className="w-4 h-4 shrink-0" />
          Add Staff
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..." className="pl-9 rounded-xl w-full" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="h-10 w-full sm:w-auto sm:min-w-[12rem] rounded-xl border border-input bg-background px-3 text-sm shrink-0">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-sm min-w-[36rem]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Role</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Assigned</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Resolved</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium text-foreground">{s.name}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{s.email}</td>
                    <td className="p-3 text-muted-foreground">{s.department}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{s.role}</td>
                    <td className="p-3 text-foreground">{s.assignedComplaints}</td>
                    <td className="p-3 text-foreground hidden md:table-cell">{s.resolvedComplaints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl w-[calc(100vw-1.5rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add staff member</DialogTitle>
            <DialogDescription>
              Create a new staff record. They will appear in the directory and can be assigned to complaints.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="staff-name">Full name</label>
              <Input
                id="staff-name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="rounded-xl"
                placeholder="e.g. Dr. Jane Smith"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="staff-email">Work email</label>
              <Input
                id="staff-email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="rounded-xl"
                placeholder="name@hospital.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="staff-dept">Department</label>
              <select
                id="staff-dept"
                value={form.departmentId}
                onChange={e => setForm(p => ({ ...p, departmentId: e.target.value }))}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" htmlFor="staff-role">Job title / role</label>
              <Input
                id="staff-role"
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="rounded-xl"
                placeholder="e.g. Nurse, Physician"
              />
            </div>
            <Button className="w-full rounded-xl" onClick={handleAddStaff}>Add staff member</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div></AnimatedPage>
  );
}
