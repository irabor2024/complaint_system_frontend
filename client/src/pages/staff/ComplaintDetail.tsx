import { useParams } from 'react-router-dom';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedPage from '@/components/AnimatedPage';

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'under-review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const complaint = complaints.find(c => c.id === id);
  const [response, setResponse] = useState('');

  if (!complaint) return (
    <div className="text-center py-16 text-muted-foreground">
      <p>Complaint not found.</p>
      <Link to="/dashboard" className="text-primary hover:underline mt-2 inline-block">Back to Dashboard</Link>
    </div>
  );

  const handleResponse = () => {
    if (!response.trim()) return;
    toast.success('Response submitted successfully');
    setResponse('');
  };

  return (
    <AnimatedPage><div className="max-w-3xl mx-auto w-full min-w-0 space-y-4 sm:space-y-6">
      <Link to="/dashboard/assigned" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 shrink-0" /> Back to Complaints
      </Link>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground break-all">{complaint.ticketId}</h1>
              <p className="text-sm text-muted-foreground mt-1 break-words">{complaint.category} • {complaint.department}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 self-start ${statusColors[complaint.status]}`}>{complaint.status}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm border-t border-border pt-4">
            <div className="min-w-0"><span className="text-muted-foreground">Patient:</span> <span className="font-medium text-foreground ml-1 break-words">{complaint.patientName}</span></div>
            <div className="min-w-0 sm:col-span-2"><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground ml-1 break-all">{complaint.patientEmail}</span></div>
            <div className="min-w-0"><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground ml-1 break-all">{complaint.patientPhone}</span></div>
            <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium text-foreground ml-1">{complaint.priority}</span></div>
            <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
            <div><span className="text-muted-foreground">SLA Deadline:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.slaDeadline).toLocaleDateString()}</span></div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-2">Description</p>
            <p className="text-sm text-muted-foreground">{complaint.description}</p>
          </div>

          {/* Timeline */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Status Timeline</p>
            <div className="space-y-3">
              {complaint.timeline.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === complaint.timeline.length - 1 ? 'bg-primary' : 'bg-muted'}`}>
                      <Circle className={`w-3 h-3 ${i === complaint.timeline.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    {i < complaint.timeline.length - 1 && <div className="w-px h-5 bg-border mt-1" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.note}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()} • {t.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm font-medium text-foreground">Actions</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <select className="h-9 w-full sm:w-auto min-w-0 sm:min-w-[10rem] rounded-xl border border-input bg-background px-3 text-sm">
                <option>Update Status</option>
                <option value="in-progress">In Progress</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
              <select className="h-9 w-full sm:w-auto min-w-0 sm:min-w-[10rem] rounded-xl border border-input bg-background px-3 text-sm">
                <option>Change Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <Button variant="outline" size="sm" className="rounded-xl w-full sm:w-auto" onClick={() => toast.success('Status updated')}>Apply</Button>
            </div>

            <div>
              <textarea value={response} onChange={e => setResponse(e.target.value)}
                className="w-full min-h-[80px] rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
                placeholder="Write a response to the patient..." />
              <Button className="rounded-xl mt-2" size="sm" onClick={handleResponse}>Send Response</Button>
            </div>
          </div>

          {/* Responses */}
          {complaint.responses.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium text-foreground mb-3">Responses</p>
              {complaint.responses.map(r => (
                <div key={r.id} className="bg-muted rounded-xl p-4 mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{r.by}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div></AnimatedPage>
  );
}
