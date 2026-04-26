import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '@/components/AnimatedPage';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const statusColors: Record<string, string> = {
  Submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'Under Review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function PatientComplaints() {
  const myComplaints = useMemo(() => complaints.slice(0, 20), []);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">My Complaints</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              View all your submitted complaints and current statuses.
            </p>
          </div>
          <Link to="/dashboard/submit" className="w-full sm:w-auto">
            <Button className="rounded-xl w-full sm:w-auto">+ Submit New Complaint</Button>
          </Link>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0">
              <table className="w-full text-sm min-w-[40rem]">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Department</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myComplaints.map((c) => (
                    <tr key={c.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-primary">{c.ticketId}</td>
                      <td className="p-3 text-foreground">{c.category}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{c.department}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status] ?? 'bg-muted text-muted-foreground'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
