import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { complaintService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { complaintStatusBadgeClass } from '@/lib/complaintUi';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const mine = user?.id ? complaints.filter(c => c.assignedStaffId === user.id) : [];
  const open = mine.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const done = mine.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Your assigned complaints at a glance.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <ClipboardList className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{mine.length}</p>
                <p className="text-sm text-muted-foreground">Assigned to you</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <Clock className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{open}</p>
                <p className="text-sm text-muted-foreground">Open / in progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-5 flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{done}</p>
                <p className="text-sm text-muted-foreground">Resolved or closed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex justify-between items-center gap-2">
              <h2 className="font-semibold text-foreground">Your queue</h2>
              <Link to="/dashboard/assigned" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {isPending ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Loading…</p>
            ) : mine.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No complaints assigned to you yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mine.slice(0, 6).map(c => (
                      <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">
                          <Link to={`/dashboard/complaint/${c.id}`} className="text-primary font-medium hover:underline">{c.ticketId}</Link>
                        </td>
                        <td className="p-3">{c.patientName}</td>
                        <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${complaintStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
