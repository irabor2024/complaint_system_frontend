import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '@/services/api';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { ComplaintStatus } from '@/types';
import { toast } from 'sonner';

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const { userName } = useAuth();
  const queryClient = useQueryClient();
  const [response, setResponse] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getById(id!),
    enabled: !!id,
  });

  const addResponseMut = useMutation({
    mutationFn: () => complaintService.addResponse(id!, response, userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      setResponse('');
      toast.success('Response added successfully');
    },
  });

  const updateStatusMut = useMutation({
    mutationFn: () => complaintService.updateStatus(id!, newStatus as ComplaintStatus, userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setNewStatus('');
      toast.success('Status updated successfully');
    },
  });

  if (isLoading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  if (!complaint) return <div className="flex items-center justify-center h-64 text-muted-foreground">Complaint not found.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold text-foreground">{complaint.ticketId}</h1>
        <div className="flex gap-2">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Complaint Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="font-medium text-foreground ml-1">{complaint.patientName}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground ml-1">{complaint.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground ml-1">{complaint.phone}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground ml-1">{complaint.category}</span></div>
                <div><span className="text-muted-foreground">Department:</span> <span className="font-medium text-foreground ml-1">{complaint.department}</span></div>
                <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{complaint.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responses */}
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Responses</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {complaint.responses.map(r => (
                <div key={r.id} className="border-l-2 border-primary pl-4 py-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{r.responderName}</p>
                    {r.statusChange && <StatusBadge status={r.statusChange} />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              ))}
              {complaint.responses.length === 0 && <p className="text-sm text-muted-foreground">No responses yet.</p>}

              <div className="border-t pt-4 space-y-3">
                <Label>Add Response</Label>
                <Textarea placeholder="Type your response..." value={response} onChange={e => setResponse(e.target.value)} rows={3} />
                <Button onClick={() => addResponseMut.mutate()} disabled={!response.trim()}>Send Response</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
            <CardContent>
              <StatusTimeline currentStatus={complaint.status} />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" onClick={() => updateStatusMut.mutate()} disabled={!newStatus}>Update Status</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
