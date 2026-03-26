import { useQuery } from '@tanstack/react-query';
import { staffService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AdminStaff() {
  const { data: staff = [] } = useQuery({ queryKey: ['staff'], queryFn: staffService.getAll });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Resolved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{s.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell><Badge variant={s.role === 'admin' ? 'default' : 'secondary'}>{s.role}</Badge></TableCell>
                    <TableCell>{s.assignedComplaints}</TableCell>
                    <TableCell>{s.resolvedComplaints}</TableCell>
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
