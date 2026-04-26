import { ComplaintStatus } from '@/types';
import { CheckCircle, Circle, Clock, FileSearch, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps: { status: ComplaintStatus; icon: typeof Circle }[] = [
  { status: 'Submitted', icon: Circle },
  { status: 'Under Review', icon: FileSearch },
  { status: 'In Progress', icon: Loader2 },
  { status: 'Resolved', icon: CheckCircle },
  { status: 'Closed', icon: CheckCircle },
];

const statusOrder: Record<ComplaintStatus, number> = {
  'Submitted': 0,
  'Under Review': 1,
  'In Progress': 2,
  'Resolved': 3,
  'Closed': 4,
};

export function StatusTimeline({ currentStatus }: { currentStatus: ComplaintStatus }) {
  const currentIdx = statusOrder[currentStatus];

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isCompleted = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground',
                isCurrent && 'ring-4 ring-primary/20'
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {i < steps.length - 1 && (
                <div className={cn('w-0.5 h-8', isCompleted ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
            <div className="pt-1">
              <p className={cn('text-sm font-medium', isCompleted ? 'text-foreground' : 'text-muted-foreground')}>
                {step.status}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
