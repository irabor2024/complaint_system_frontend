import { useMemo } from 'react';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { StatCardSkeleton, ComplaintListSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'Under Review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function PatientDashboard() {
  const loading = useSimulatedLoading(900);
  const myComplaints = useMemo(() => complaints.slice(0, 12), []);
  const total = myComplaints.length;
  const active = myComplaints.filter(c => !['Resolved', 'Closed'].includes(c.status)).length;
  const resolved = myComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const stats = [
    { label: 'Total Complaints', value: total, icon: FileText, color: 'text-primary' },
    { label: 'Active', value: active, icon: Clock, color: 'text-yellow-500' },
    { label: 'Resolved', value: resolved, icon: CheckCircle, color: 'text-green-500' },
  ];

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Overview of your complaints</p>
        </div>

        {loading ? (
          <>
            <StatCardSkeleton count={3} />
            <ComplaintListSkeleton />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                <div className="p-3 sm:p-4 border-b border-border flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-semibold text-foreground text-sm sm:text-base">Recent Complaints</h2>
                  <Link to="/dashboard/submit" className="text-sm text-primary hover:underline shrink-0 self-start sm:self-auto">+ New Complaint</Link>
                </div>
                <div className="divide-y divide-border">
                  {myComplaints.slice(0, 5).map(c => (
                    <div key={c.id} className="p-3 sm:p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-foreground text-sm">{c.ticketId}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[c.status]}`}>{c.status}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 sm:truncate mt-0.5">{c.description}</p>
                      </div>
                      <div className="text-xs text-muted-foreground sm:ml-4 sm:text-right sm:whitespace-nowrap shrink-0">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AnimatedPage>
  );
}
