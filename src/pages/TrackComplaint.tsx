import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { Search, FileSearch } from 'lucide-react';
import { complaintService } from '@/services/api';
import { Complaint } from '@/types';

export default function TrackComplaint() {
  const [searchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;
    setLoading(true);
    setNotFound(false);
    const result = await complaintService.getByTicketId(ticketId.trim());
    if (result) {
      setComplaint(result);
      setNotFound(false);
    } else {
      setComplaint(null);
      setNotFound(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Complaint</h1>
          <p className="text-muted-foreground">Enter your ticket ID to check the status of your complaint.</p>
        </div>

        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                placeholder="Enter Ticket ID (e.g., CMP-2026-0001)"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {notFound && (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Complaint Not Found</h3>
              <p className="text-muted-foreground">No complaint found with ticket ID "{ticketId}". Please check and try again.</p>
            </CardContent>
          </Card>
        )}

        {complaint && (
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-xl">{complaint.ticketId}</CardTitle>
                  <div className="flex gap-2">
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium text-foreground ml-1">{complaint.category}</span></div>
                  <div><span className="text-muted-foreground">Department:</span> <span className="font-medium text-foreground ml-1">{complaint.department}</span></div>
                  <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.createdAt).toLocaleDateString()}</span></div>
                  <div><span className="text-muted-foreground">Last Updated:</span> <span className="font-medium text-foreground ml-1">{new Date(complaint.updatedAt).toLocaleDateString()}</span></div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground bg-muted/50 rounded-lg p-3">{complaint.description}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-lg">Status Progress</CardTitle></CardHeader>
                <CardContent>
                  <StatusTimeline currentStatus={complaint.status} />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-lg">Responses</CardTitle></CardHeader>
                <CardContent>
                  {complaint.responses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No responses yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {complaint.responses.map(r => (
                        <div key={r.id} className="border-l-2 border-primary pl-4">
                          <p className="text-sm font-medium text-foreground">{r.responderName}</p>
                          <p className="text-sm text-muted-foreground mt-1">{r.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
