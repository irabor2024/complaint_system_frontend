import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Complaint } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import AnimatedPage from '@/components/AnimatedPage';
import { ChartSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { complaintService } from '@/services/api';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function monthKey(d: Date) {
  return d.getFullYear() * 12 + d.getMonth();
}

function hoursBetween(a: string, b: string) {
  return Math.max(0, (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60));
}

function buildAnalytics(complaints: Complaint[]) {
  const byCategory: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  complaints.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    const dept = c.department || 'Unknown';
    byDepartment[dept] = (byDepartment[dept] || 0) + 1;
  });

  const now = new Date();
  const year = now.getFullYear();
  const startKey = year * 12 + 0;
  const endKey = year * 12 + 11;

  const submittedByMonth = new Map<number, number>();
  const resolvedByMonth = new Map<number, number>();
  complaints.forEach(c => {
    const created = new Date(c.createdAt);
    if (monthKey(created) >= startKey && monthKey(created) <= endKey) {
      const m = created.getMonth();
      submittedByMonth.set(m, (submittedByMonth.get(m) || 0) + 1);
    }
    if (c.status === 'Resolved' || c.status === 'Closed') {
      const up = new Date(c.updatedAt);
      if (monthKey(up) >= startKey && monthKey(up) <= endKey) {
        const m = up.getMonth();
        resolvedByMonth.set(m, (resolvedByMonth.get(m) || 0) + 1);
      }
    }
  });

  const monthly = MONTH_LABELS.map((name, m) => ({
    name,
    complaints: submittedByMonth.get(m) || 0,
    resolved: resolvedByMonth.get(m) || 0,
  }));

  const resolutionBuckets: Record<string, { sum: number; n: number }> = {};
  complaints.forEach(c => {
    if (c.status !== 'Resolved' && c.status !== 'Closed') return;
    const dept = c.department || 'Unknown';
    const h = hoursBetween(c.createdAt, c.updatedAt);
    if (!resolutionBuckets[dept]) resolutionBuckets[dept] = { sum: 0, n: 0 };
    resolutionBuckets[dept].sum += h;
    resolutionBuckets[dept].n += 1;
  });
  const resolutionTime = Object.entries(resolutionBuckets).map(([name, { sum, n }]) => ({
    name,
    hours: n ? Math.round((sum / n) * 10) / 10 : 0,
  }));

  return {
    byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
    byDepartment: Object.entries(byDepartment).map(([name, value]) => ({ name, value })),
    monthly,
    resolutionTime,
  };
}

export default function AnalyticsDashboard() {
  const isMobile = useIsMobile();
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const { byCategory, byDepartment, monthly, resolutionTime } = useMemo(
    () => buildAnalytics(complaints),
    [complaints]
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Insights and trends from live complaints</p>
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : complaints.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              No complaints yet. Submit or import complaints to see analytics charts.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="rounded-2xl min-w-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Complaints by Category</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 220 : 280}>
                  <PieChart>
                    <Pie
                      data={byCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 72 : 96}
                      label={isMobile ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {byCategory.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    {isMobile && <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />}
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl min-w-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Complaints by Department</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
                  <BarChart
                    data={byDepartment}
                    margin={isMobile ? { bottom: 48, left: 0, right: 8 } : { bottom: 8, left: 8, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                      interval={0}
                      angle={isMobile ? -35 : 0}
                      textAnchor={isMobile ? 'end' : 'middle'}
                      height={isMobile ? 56 : 32}
                    />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 28 : 36} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl min-w-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  Monthly trends ({new Date().getFullYear()})
                </h3>
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
                  <LineChart data={monthly} margin={isMobile ? { left: 0, right: 8, bottom: 0 } : { left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: isMobile ? 9 : 12 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 28 : 36} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 12 }} />
                    <Line type="monotone" dataKey="complaints" stroke="#2563EB" strokeWidth={2} dot={{ r: isMobile ? 2 : 3 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} dot={{ r: isMobile ? 2 : 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl min-w-0">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
                  Avg. resolution time (hours), by department
                </h3>
                {resolutionTime.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No resolved or closed complaints yet to compute averages.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
                    <AreaChart
                      data={resolutionTime}
                      margin={isMobile ? { bottom: 44, left: 0, right: 8 } : { bottom: 8, left: 8, right: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: isMobile ? 9 : 12 }}
                        interval={0}
                        angle={isMobile ? -35 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 52 : 32}
                      />
                      <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} width={isMobile ? 28 : 36} />
                      <Tooltip />
                      <Area type="monotone" dataKey="hours" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.15} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
