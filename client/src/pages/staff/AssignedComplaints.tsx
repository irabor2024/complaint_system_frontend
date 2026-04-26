import { useMemo, useState } from 'react';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
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

export default function AssignedComplaints() {
  const assigned = useMemo(() => complaints.filter(c => c.assignedStaffId === 'staff-1'), []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return assigned.filter(c => {
      if (search && !c.ticketId.toLowerCase().includes(search.toLowerCase()) && !c.patientName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (priorityFilter && c.priority !== priorityFilter) return false;
      return true;
    });
  }, [assigned, search, statusFilter, priorityFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <AnimatedPage><div className="space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Assigned Complaints</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage and respond to your assigned complaints</p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-3 sm:p-4 space-y-4">
          <div className="space-y-3">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by ticket or patient..." className="pl-9 rounded-xl w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm min-w-0">
                <option value="">All Status</option>
                {['submitted', 'in-progress', 'under-review', 'resolved', 'closed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); setPage(1); }}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm min-w-0">
                <option value="">All Priority</option>
                {['low', 'medium', 'high'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
            <table className="w-full text-sm min-w-[40rem]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Priority</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(c => (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium text-foreground">{c.ticketId}</td>
                    <td className="p-3 text-foreground">{c.patientName}</td>
                    <td className="p-3 text-muted-foreground hidden md:table-cell">{c.category}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[c.priority]}`}>{c.priority}</span></td>
                    <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{c.status}</span></td>
                    <td className="p-3 text-muted-foreground hidden lg:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Link to={`/dashboard/complaint/${c.id}`}>
                        <Button variant="ghost" size="sm" className="rounded-xl text-xs">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-sm text-muted-foreground text-center sm:text-left">{filtered.length} results</p>
              <div className="flex flex-wrap justify-center gap-1 max-w-full overflow-x-auto pb-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i} variant={page === i + 1 ? 'default' : 'outline'} size="sm" className="rounded-xl w-9 h-9 shrink-0"
                    onClick={() => setPage(i + 1)}>{i + 1}</Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div></AnimatedPage>
  );
}
