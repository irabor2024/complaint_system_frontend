import { useState } from 'react';
import { complaints } from '@/mock-data/complaints';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, CheckCircle, Clock, Circle } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
const statusColors: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'in-progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  'under-review': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  resolved: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function TrackComplaint() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<typeof complaints[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const found = complaints.find(c => c.ticketId.toLowerCase() === query.trim().toLowerCase());
    setResult(found || null);
  };

  return (
    <AnimatedPage><div className="max-w-2xl mx-auto w-full min-w-0 space-y-4 sm:space-y-6">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Track Your Complaint</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Enter your ticket ID to view the status.</p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Ticket ID (e.g., TKT-1001)" className="pl-9 rounded-xl w-full" />
            </div>
            <Button onClick={handleSearch} className="rounded-xl w-full sm:w-auto shrink-0">Track</Button>
          </div>
        </CardContent>
      </Card>

      {searched && !result && (
        <Card className="rounded-2xl">
          <CardContent className="p-6 sm:p-8 text-center">
            <p className="text-muted-foreground">No complaint found with that ticket ID. Please check and try again.</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="rounded-2xl">
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-foreground break-all">{result.ticketId}</h2>
                <p className="text-sm text-muted-foreground mt-1 break-words">{result.category} • {result.department}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 self-start ${statusColors[result.status]}`}>{result.status}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium text-foreground ml-1">{result.priority}</span></div>
              <div><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground ml-1">{new Date(result.createdAt).toLocaleDateString()}</span></div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">Description</p>
              <p className="text-sm text-foreground">{result.description}</p>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Status Timeline</p>
              <div className="space-y-4">
                {result.timeline.map((t, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === result.timeline.length - 1 ? 'bg-primary' : 'bg-muted'}`}>
                        {t.status === 'resolved' || t.status === 'closed' ? (
                          <CheckCircle className={`w-3.5 h-3.5 ${i === result.timeline.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        ) : (
                          <Circle className={`w-3 h-3 ${i === result.timeline.length - 1 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                      {i < result.timeline.length - 1 && <div className="w-px h-6 bg-border mt-1" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.note}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responses */}
            {result.responses.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Staff Responses</p>
                {result.responses.map(r => (
                  <div key={r.id} className="bg-muted rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{r.by}</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div></AnimatedPage>
  );
}
