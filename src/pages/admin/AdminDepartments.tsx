import { useQuery } from '@tanstack/react-query';
import { complaintService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Department } from '@/types';

const departments: Department[] = ['Emergency', 'Billing', 'Pharmacy', 'Laboratory', 'Ward', 'Administration'];

export default function AdminDepartments() {
  const { data: complaints = [] } = useQuery({ queryKey: ['complaints'], queryFn: complaintService.getAll });

  const deptStats = departments.map(d => ({
    name: d,
    total: complaints.filter(c => c.department === d).length,
    pending: complaints.filter(c => c.department === d && c.status !== 'Resolved' && c.status !== 'Closed').length,
    resolved: complaints.filter(c => c.department === d && (c.status === 'Resolved' || c.status === 'Closed')).length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deptStats.map(d => (
          <Card key={d.name} className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-lg">{d.name}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-2xl font-bold text-foreground">{d.total}</p><p className="text-xs text-muted-foreground">Total</p></div>
                <div><p className="text-2xl font-bold text-warning">{d.pending}</p><p className="text-xs text-muted-foreground">Pending</p></div>
                <div><p className="text-2xl font-bold text-success">{d.resolved}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
