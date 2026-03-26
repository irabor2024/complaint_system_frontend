import { useQuery } from '@tanstack/react-query';
import { complaintService, staffService } from '@/services/api';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, Building2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: complaints = [] } = useQuery({ queryKey: ['complaints'], queryFn: complaintService.getAll });
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');
  const pending = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');

  // Top department
  const deptCounts = complaints.reduce((acc, c) => { acc[c.department] = (acc[c.department] || 0) + 1; return acc; }, {} as Record<string, number>);
  const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value={complaints.length} icon={FileText} />
        <StatCard title="Resolved" value={resolved.length} icon={CheckCircle} trend={`${Math.round(resolved.length / complaints.length * 100)}% resolution rate`} />
        <StatCard title="Pending" value={pending.length} icon={Clock} />
        <StatCard title="Top Department" value={topDept ? topDept[0] : 'N/A'} description={topDept ? `${topDept[1]} complaints` : ''} icon={Building2} />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Complaints</CardTitle>
          <Link to="/admin/complaints"><Button variant="outline" size="sm">View All</Button></Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.slice(0, 8).map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.ticketId}</TableCell>
                    <TableCell>{c.patientName}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.department}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link to={`/admin/complaints/${c.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
