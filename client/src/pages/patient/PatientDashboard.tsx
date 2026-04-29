import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, Eye } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { complaintService } from '@/services/api';
import { complaintStatusBadgeClass } from '@/lib/complaintUi';

export default function PatientDashboard() {
  const { data: complaints = [], isPending } = useQuery({
    queryKey: ['complaints'],
    queryFn: complaintService.getAll,
  });

  const recent = complaints.slice(0, 5);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Patient Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome back — here is a snapshot of your complaints.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link to="/dashboard/submit">
            <Card className="rounded-2xl hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <PlusCircle className="w-8 h-8 text-primary" />
                <p className="font-semibold text-foreground">Submit Complaint</p>
                <p className="text-xs text-muted-foreground">Tell us about an issue</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/track">
            <Card className="rounded-2xl hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <Eye className="w-8 h-8 text-primary" />
                <p className="font-semibold text-foreground">Track Complaint</p>
                <p className="text-xs text-muted-foreground">Use your ticket ID</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/dashboard/complaints">
            <Card className="rounded-2xl hover:border-primary/50 transition-colors h-full">
              <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                <FileText className="w-8 h-8 text-primary" />
                <p className="font-semibold text-foreground">My Complaints</p>
                <p className="text-xs text-muted-foreground">{complaints.length} total</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between gap-2">
              <h2 className="font-semibold text-foreground">Recent complaints</h2>
              <Button variant="outline" size="sm" className="rounded-xl" asChild>
                <Link to="/dashboard/complaints">View all</Link>
              </Button>
            </div>
            {isPending ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Loading…</p>
            ) : recent.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">No complaints yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left p-3 font-medium text-muted-foreground">Ticket</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map(c => (
                      <tr key={c.id} className="border-b border-border">
                        <td className="p-3 font-medium">{c.ticketId}</td>
                        <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${complaintStatusBadgeClass(c.status)}`}>{c.status}</span></td>
                        <td className="p-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
