import { Priority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityConfig: Record<Priority, string> = {
  'Low': 'bg-muted text-muted-foreground hover:bg-muted',
  'Medium': 'bg-info/15 text-info hover:bg-info/20',
  'High': 'bg-warning/15 text-warning hover:bg-warning/20',
  'Critical': 'bg-destructive/15 text-destructive hover:bg-destructive/20',
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={cn('font-medium', priorityConfig[priority])}>
      {priority}
    </Badge>
  );
}
