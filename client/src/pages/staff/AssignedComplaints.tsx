import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedPage from '@/components/AnimatedPage';
import { complaintService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { complaintStatusBadgeClass } from '@/lib/complaintUi';

export default function AssignedComplaints() {
  const { user } = useAuth();
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const mine = user?.id ? complaints.filter(c => c.assignedStaffId === user.id) : [];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Assigned Complaints</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Complaints currently assigned to you.</p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {isPending ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Loading…</p>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[36rem]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map(c => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                      <td className="p-3">
                        <Link to={`/dashboard/complaint/${c.id}`} className="text-primary font-medium hover:underline">{c.ticketId}</Link>
                      </td>
                      <td className="p-3">{c.patientName}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{c.department}</td>
                      <td className="p-3">{c.priority}</td>
                      <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${complaintStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {!isPending && mine.length === 0 && (
              <p className="p-6 text-sm text-muted-foreground text-center">No assigned complaints.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
