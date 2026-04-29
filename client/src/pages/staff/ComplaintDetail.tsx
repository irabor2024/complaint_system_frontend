import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AnimatedPage from '@/components/AnimatedPage';
import { complaintService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { ComplaintStatus } from '@/types';
import { complaintStatusBadgeClass, priorityBadgeClass } from '@/lib/complaintUi';
import { ApiRequestError } from '@/lib/apiClient';

const STATUS_OPTIONS: ComplaintStatus[] = [
  'Submitted',
  'Under Review',
  'In Progress',
  'Resolved',
  'Closed',
];

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusPick, setStatusPick] = useState<ComplaintStatus | ''>('');
  const [priorityPick, setPriorityPick] = useState('');
  const [response, setResponse] = useState('');

  const { data: complaint, isPending, isError } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintService.getById(id!),
    enabled: Boolean(id),
  });

  const statusMutation = useMutation({
    mutationFn: () => complaintService.updateStatus(id!, statusPick as ComplaintStatus),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setStatusPick('');
    },
    onError: (e: unknown) => {
      toast.error(e instanceof ApiRequestError ? e.message : 'Update failed');
    },
  });

  const priorityMutation = useMutation({
    mutationFn: () => complaintService.setPriority(id!, priorityPick as 'Low' | 'Medium' | 'High' | 'Critical'),
    onSuccess: () => {
      toast.success('Priority updated');
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setPriorityPick('');
    },
    onError: (e: unknown) => {
      toast.error(e instanceof ApiRequestError ? e.message : 'Update failed');
    },
  });

  const responseMutation = useMutation({
    mutationFn: () => complaintService.addResponse(id!, response.trim()),
    onSuccess: () => {
      toast.success('Response submitted');
      setResponse('');
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
    },
    onError: (e: unknown) => {
      toast.error(e instanceof ApiRequestError ? e.message : 'Failed to send response');
    },
  });

  if (isPending) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">Loading complaint…</div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>Complaint not found.</p>
        <Link to="/dashboard" className="text-primary hover:underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const canAct = user?.role === 'admin' || (user?.role === 'staff' && complaint.assignedStaffId === user.id);
  const isAdmin = user?.role === 'admin';

  return (
    <AnimatedPage><div className="max-w-3xl mx-auto w-full min-w-0 space-y-4 sm:space-y-6">
      <Link
        to={user?.role === 'admin' ? '/dashboard/complaints' : '/dashboard/assigned'}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 shrink-0" /> Back to Complaints
      </Link>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground break-all">{complaint.ticketId}</h1>
              <p className="text-sm text-muted-foreground mt-1 break-words">{complaint.category} • {complaint.department}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 self-start ${complaintStatusBadgeClass(complaint.status)}`}>{complaint.status}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm border-t border-border pt-4">
            <div className="min-w-0"><span className="text-muted-foreground">Patient:</span> <span className="font-medium text-foreground ml-1 break-words">{complaint.patientName}</span></div>
            <div className="min-w-0 sm:col-span-2"><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground ml-1 break-all">{complaint.email}</span></div>
            <div className="min-w-0"><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground ml-1 break-all">{complaint.phone}</span></div>
            <div><span className="text-muted-foreground">Priority:</span> <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${priorityBadgeClass(complaint.priority)}`}>{complaint.priority}</span></div>
            <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-2">Description</p>
            <p className="text-sm text-muted-foreground">{complaint.description}</p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-foreground mb-3">Activity</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Circle className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Complaint submitted</p>
                  <p className="text-xs text-muted-foreground">{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {complaint.responses.map((r, i) => (
                <div key={r.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === complaint.responses.length - 1 ? 'bg-primary' : 'bg-muted'}`}>
                      <Circle className={`w-3 h-3 ${i === complaint.responses.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.responderName}{r.statusChange ? ` — ${r.statusChange}` : ''}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-1">{r.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canAct && (
            <div className="border-t border-border pt-4 space-y-4">
              <p className="text-sm font-medium text-foreground">Actions</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <select
                  value={statusPick}
                  onChange={e => setStatusPick(e.target.value as ComplaintStatus | '')}
                  className="h-9 w-full sm:w-auto min-w-0 sm:min-w-[10rem] rounded-xl border border-input bg-background px-3 text-sm"
                >
                  <option value="">Update status…</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl w-full sm:w-auto"
                  disabled={!statusPick || statusMutation.isPending}
                  onClick={() => statusPick && statusMutation.mutate()}
                >
                  Apply status
                </Button>
              </div>

              {isAdmin && (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    value={priorityPick}
                    onChange={e => setPriorityPick(e.target.value)}
                    className="h-9 w-full sm:w-auto min-w-0 sm:min-w-[10rem] rounded-xl border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Set priority…</option>
                    {(['Low', 'Medium', 'High', 'Critical'] as const).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl w-full sm:w-auto"
                    disabled={!priorityPick || priorityMutation.isPending}
                    onClick={() => priorityPick && priorityMutation.mutate()}
                  >
                    Apply priority
                  </Button>
                </div>
              )}

              <div>
                <textarea
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                  className="w-full min-h-[80px] rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none"
                  placeholder="Write a response to the patient..."
                />
                <Button
                  className="rounded-xl mt-2"
                  size="sm"
                  disabled={!response.trim() || responseMutation.isPending}
                  onClick={() => responseMutation.mutate()}
                >
                  Send Response
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div></AnimatedPage>
  );
}
