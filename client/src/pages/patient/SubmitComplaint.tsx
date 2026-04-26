import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { departments } from '@/mock-data/departments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
const categories = [
  { value: 'billing', label: 'Billing' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'staff-behavior', label: 'Staff Behavior' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'wait-time', label: 'Wait Time' },
  { value: 'other', label: 'Other' },
];

export default function SubmitComplaint() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: '', department: '', priority: 'medium', description: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TKT-${Math.floor(Math.random() * 9000 + 1000)}`;
    setTicketId(id);
    setShowSuccess(true);
    setForm({ name: '', email: '', phone: '', category: '', department: '', priority: 'medium', description: '' });
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <AnimatedPage><div className="max-w-2xl mx-auto w-full min-w-0 space-y-4 sm:space-y-6 px-0">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Submit a Complaint</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Fill out the form below to submit your complaint.</p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name *</label>
                <Input value={form.name} onChange={e => update('name', e.target.value)} className="rounded-xl" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="rounded-xl" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
              <Input value={form.phone} onChange={e => update('phone', e.target.value)} className="rounded-xl" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category *</label>
                <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm" required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Department *</label>
                <select value={form.department} onChange={e => update('department', e.target.value)} className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm" required>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Priority</label>
              <div className="flex flex-wrap gap-2">
                {['low', 'medium', 'high'].map(p => (
                  <button key={p} type="button" onClick={() => update('priority', p)}
                    className={`flex-1 min-w-[5.5rem] sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${form.priority === p ? 'bg-primary text-primary-foreground border-primary' : 'border-input text-muted-foreground hover:bg-accent'}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)}
                className="w-full min-h-[120px] rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Attachments</label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 sm:p-6 text-center text-xs sm:text-sm text-muted-foreground">
                Drag & drop files here or click to browse
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl" size="lg">Submit Complaint</Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="rounded-2xl text-center w-[calc(100vw-1.5rem)] sm:max-w-lg">
          <DialogHeader>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-xl">Complaint Submitted!</DialogTitle>
            <DialogDescription>
              Your complaint has been submitted successfully. Your ticket ID is:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted rounded-xl p-4 text-2xl font-bold text-primary">{ticketId}</div>
          <p className="text-sm text-muted-foreground">Save this ID to track your complaint status.</p>
        </DialogContent>
      </Dialog>
    </div></AnimatedPage>
  );
}
