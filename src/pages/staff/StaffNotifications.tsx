import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, FileText, CheckCircle, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons = {
  new_complaint: FileText,
  assignment: Bell,
  resolution: CheckCircle,
  response: MessageSquare,
};

export default function StaffNotifications() {
  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: notificationService.getAll });

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
      <div className="space-y-3">
        {notifications.map(n => {
          const Icon = typeIcons[n.type];
          return (
            <Card key={n.id} className={cn('shadow-sm', !n.read && 'border-primary/30 bg-primary/5')}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2" />}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
