import { useMemo } from 'react';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { StatCardSkeleton, TableSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';

const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'under-review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export default function StaffDashboard() {
  const loading = useSimulatedLoading(900);
  const assigned = useMemo(() => complaints.filter(c => c.assignedStaffId === 'staff-1'), []);
  const pending = assigned.filter(c => c.status === 'submitted' || c.status === 'in-progress');
  const resolved = assigned.filter(c => c.status === 'resolved' || c.status === 'closed');

  const stats = [
    { label: 'Assigned', value: assigned.length, icon: ClipboardList, color: 'text-primary' },
    { label: 'Pending', value: pending.length, icon: Clock, color: 'text-yellow-500' },
    { label: 'Resolved', value: resolved.length, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Avg Response', value: '2.4h', icon: AlertCircle, color: 'text-purple-500' },
  ];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Staff Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your assigned complaints</p>
        </div>

        {loading ? (
          <>
            <StatCardSkeleton count={4} />
            <TableSkeleton rows={6} cols={5} />
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
                  <h2 className="font-semibold text-foreground">Recent Assigned Complaints</h2>
                </div>
                <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
                  <table className="w-full text-sm min-w-[36rem]">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                        <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                        <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assigned.slice(0, 5).map(c => (
                        <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <Link to={`/dashboard/complaint/${c.id}`} className="text-primary hover:underline font-medium">{c.ticketId}</Link>
                          </td>
                          <td className="p-3 text-foreground">{c.patientName}</td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">{c.category}</td>
                          <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[c.priority]}`}>{c.priority}</span></td>
                          <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span></td>
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
