import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  className?: string;
}

function AnimatedCounter({ value }: { value: string | number }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue) && typeof value === 'number';
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isNumeric || !ref.current) return;
    const controls = animate(0, numericValue, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [numericValue, isNumeric]);

  if (!isNumeric) return <>{value}</>;
  return <span ref={ref}>0</span>;
}

export function StatCard({ title, value, icon: Icon, description, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px hsl(var(--primary) / 0.15)' }}
    >
      <Card className={cn('shadow-sm transition-shadow', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold text-foreground">
                <AnimatedCounter value={value} />
              </p>
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
              {trend && <p className="text-xs font-medium text-success">{trend}</p>}
            </div>
            <motion.div
              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
