import { useQuery } from '@tanstack/react-query';
import { complaintService } from '@/services/api';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, Timer, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StaffDashboard() {
  const { data: allComplaints = [] } = useQuery({ queryKey: ['complaints'], queryFn: complaintService.getAll });
  // Simulate staff-assigned complaints (staff id s1)
  const complaints = allComplaints.filter(c => c.assignedStaffId === 's1');
  const pending = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Staff Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={complaints.length} icon={FileText} />
        <StatCard title="Pending" value={pending.length} icon={Clock} />
        <StatCard title="Resolved" value={resolved.length} icon={CheckCircle} />
        <StatCard title="Avg. Resolution" value="2.5 days" icon={Timer} />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Assigned Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.slice(0, 10).map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.ticketId}</TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.department}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                    <TableCell className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Link to={`/staff/complaints/${c.id}`}>
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> View</Button>
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
