import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { complaintService } from '@/services/api';
import { complaintStatusBadgeClass, priorityBadgeClass } from '@/lib/complaintUi';

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'] as const;
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'] as const;

export default function ComplaintManagement() {
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 15;

  const depts = useMemo(() => [...new Set(complaints.map(c => c.department))], [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter(c => {
      if (
        search &&
        !c.ticketId.toLowerCase().includes(search.toLowerCase()) &&
        !c.patientName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      if (statusFilter && c.status !== statusFilter) return false;
      if (priorityFilter && c.priority !== priorityFilter) return false;
      if (deptFilter && c.department !== deptFilter) return false;
      return true;
    });
  }, [complaints, search, statusFilter, priorityFilter, deptFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  return (
    <AnimatedPage><div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Complaint Management</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">View and manage all complaints</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 shrink-0 w-full sm:w-auto" size="sm" type="button"><Download className="w-4 h-4 shrink-0" /> Export</Button>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-3 sm:p-4 space-y-4">
          <div className="space-y-3">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="pl-9 rounded-xl w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm min-w-0">
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm min-w-0">
                <option value="">All Priority</option>
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} className="h-10 w-full sm:col-span-2 xl:col-span-1 rounded-xl border border-input bg-background px-3 text-sm min-w-0">
                <option value="">All Departments</option>
                {depts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {isPending ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Loading complaints…</p>
          ) : (
          <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-sm min-w-[44rem]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Department</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Assigned</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3"><Link to={`/dashboard/complaint/${c.id}`} className="text-primary hover:underline font-medium">{c.ticketId}</Link></td>
                    <td className="p-3 text-foreground">{c.patientName}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{c.category}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{c.department}</td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{c.assignedStaffName || '—'}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityBadgeClass(c.priority)}`}>{c.priority}</span></td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${complaintStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-sm text-muted-foreground text-center sm:text-left">{filtered.length} total</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="rounded-xl shrink-0" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                <span className="flex items-center px-2 text-sm text-muted-foreground tabular-nums">{page}/{totalPages}</span>
                <Button variant="outline" size="sm" className="rounded-xl shrink-0" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div></AnimatedPage>
  );
}
