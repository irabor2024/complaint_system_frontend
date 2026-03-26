import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, FileText } from 'lucide-react';
import { complaintService } from '@/services/api';
import { ComplaintCategory, Department, ComplaintFormData } from '@/types';

const categories: ComplaintCategory[] = ['Hygiene', 'Billing', 'Staff Behavior', 'Service Delay', 'Equipment', 'Other'];
const departments: Department[] = ['Emergency', 'Billing', 'Pharmacy', 'Laboratory', 'Ward', 'Administration'];

export default function SubmitComplaint() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ComplaintFormData>({
    patientName: '', email: '', phone: '', category: 'Hygiene', department: 'Emergency', description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const complaint = await complaintService.submit(form);
    setTicketId(complaint.ticketId);
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full shadow-lg text-center">
            <CardContent className="p-8">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted!</h2>
              <p className="text-muted-foreground mb-4">Your complaint has been successfully submitted.</p>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Your Ticket ID</p>
                <p className="text-2xl font-bold text-primary">{ticketId}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Please save this ticket ID to track your complaint status.</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { setSubmitted(false); setForm({ patientName: '', email: '', phone: '', category: 'Hygiene', department: 'Emergency', description: '' }); }}>
                  Submit Another
                </Button>
                <Button className="flex-1" onClick={() => window.location.href = `/track?id=${ticketId}`}>
                  Track Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit a Complaint</h1>
          <p className="text-muted-foreground">Please fill in the details below. All fields are required.</p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1-555-000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Complaint Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ComplaintCategory })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v as Department })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Complaint Description</Label>
                <Textarea id="description" placeholder="Please describe your complaint in detail..." rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Attachments (optional)</Label>
                <Input id="files" type="file" multiple className="cursor-pointer" />
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                <FileText className="mr-2 h-4 w-4" />
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
