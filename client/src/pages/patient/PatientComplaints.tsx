import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { complaintService } from '@/services/api';
import { complaintStatusBadgeClass } from '@/lib/complaintUi';

export default function PatientComplaints() {
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Complaints</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              View all your submitted complaints and current statuses.
            </p>
          </div>
          <Link to="/dashboard/submit" className="w-full sm:w-auto">
            <Button className="rounded-xl w-full sm:w-auto">+ Submit New Complaint</Button>
          </Link>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-0">
            {isPending ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Loading…</p>
            ) : (
            <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
              <table className="w-full text-sm min-w-[40rem]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-primary">{c.ticketId}</td>
                      <td className="p-3 text-muted-foreground">{c.category}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{c.department}</td>
                      <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${complaintStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                      <td className="p-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
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
