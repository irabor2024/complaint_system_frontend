import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categoryData, departmentData, monthlyTrend, resolutionTimeData } from '@/mock-data';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const COLORS = [
  'hsl(217, 91%, 60%)',   // primary blue
  'hsl(160, 84%, 39%)',   // success green
  'hsl(38, 92%, 50%)',    // warning amber
  'hsl(0, 84%, 60%)',     // destructive red
  'hsl(199, 89%, 48%)',   // info cyan
  'hsl(262, 80%, 60%)',   // purple
];

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Complaints by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By Department */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Complaints by Department</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="hsl(217, 91%, 60%)" name="Total" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="hsl(160, 84%, 39%)" name="Resolved" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Monthly Complaint Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="complaints" stroke="hsl(217, 91%, 60%)" strokeWidth={2} name="Complaints" />
                <Line type="monotone" dataKey="resolved" stroke="hsl(160, 84%, 39%)" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time */}
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Resolution Time Analysis</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(199, 89%, 48%)" name="Complaints" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
