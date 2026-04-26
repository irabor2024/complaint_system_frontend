import { ComplaintStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<ComplaintStatus, { className: string }> = {
  'Submitted': { className: 'bg-muted text-muted-foreground hover:bg-muted' },
  'Under Review': { className: 'bg-info/15 text-info border-info/30 hover:bg-info/20' },
  'In Progress': { className: 'bg-warning/15 text-warning border-warning/30 hover:bg-warning/20' },
  'Resolved': { className: 'bg-success/15 text-success border-success/30 hover:bg-success/20' },
  'Closed': { className: 'bg-muted text-muted-foreground border-border hover:bg-muted' },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <Badge variant="outline" className={cn('font-medium', statusConfig[status].className)}>
      {status}
    </Badge>
  );
}
