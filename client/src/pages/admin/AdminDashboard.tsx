import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Timer } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { StatCardSkeleton, TableSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';

export default function AdminDashboard() {
  const loading = useSimulatedLoading(900);
  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'submitted' || c.status === 'in-progress').length;
  const underReview = complaints.filter(c => c.status === 'under-review').length;
  const closed = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  const stats = [
    { label: 'Total Complaints', value: total, icon: FileText, color: 'text-primary' },
    { label: 'Open', value: open, icon: Clock, color: 'text-yellow-500' },
    { label: 'Under Review', value: underReview, icon: Timer, color: 'text-purple-500' },
    { label: 'Resolved/Closed', value: closed, icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">System overview and management</p>
        </div>

        {loading ? (
          <>
            <StatCardSkeleton count={4} />
            <TableSkeleton rows={8} cols={5} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {stats.map(s => (
                <Card key={s.label} className="rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-2xl">
              <CardContent className="p-0">
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Latest Complaints</h2>
                </div>
                <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                  <table className="w-full text-sm min-w-[34rem]">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                        <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                        <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Assigned</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.slice(0, 5).map(c => (
                        <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                          <td className="p-3 font-medium text-primary">{c.ticketId}</td>
                          <td className="p-3 text-foreground">{c.patientName}</td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">{c.department}</td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">{c.assignedStaffName || '—'}</td>
                          <td className="p-3"><span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AnimatedPage>
  );
}
