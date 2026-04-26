import { useMemo } from 'react';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AnimatedPage from '@/components/AnimatedPage';
import { ChartSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useIsMobile } from '@/hooks/use-mobile';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

export default function AnalyticsDashboard() {
  const loading = useSimulatedLoading(1100);
  const isMobile = useIsMobile();

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach(c => { map[c.category] = (map[c.category] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const byDepartment = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach(c => { map[c.department] = (map[c.department] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, []);

  const monthly = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((name) => ({
      name,
      complaints: Math.floor(Math.random() * 20) + 5,
      resolved: Math.floor(Math.random() * 15) + 3,
    }));
  }, []);

  const resolutionTime = useMemo(() => {
    return ['Emergency', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Radiology', 'General'].map(name => ({
      name,
      hours: Math.floor(Math.random() * 48) + 4,
    }));
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Insights and trends</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
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
                      {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
                  <BarChart data={byDepartment} margin={isMobile ? { bottom: 48, left: 0, right: 8 } : { bottom: 8, left: 8, right: 8 }}>
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
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Monthly Trends</h3>
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
                <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Avg. Resolution Time (hours)</h3>
                <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
                  <AreaChart data={resolutionTime} margin={isMobile ? { bottom: 44, left: 0, right: 8 } : { bottom: 8, left: 8, right: 8 }}>
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
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
