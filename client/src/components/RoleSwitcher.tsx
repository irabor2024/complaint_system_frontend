import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { User, Stethoscope, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: Role; label: string; icon: typeof User }[] = [
  { value: 'patient', label: 'Patient', icon: User },
  { value: 'staff', label: 'Staff', icon: Stethoscope },
  { value: 'admin', label: 'Admin', icon: Shield },
];

export function RoleSwitcher() {
  const { role, setRole } = useAuth();

  return (
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      {roles.map(r => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
            role === r.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <r.icon className="h-3.5 w-3.5" />
          {r.label}
        </button>
      ))}
    </div>
  );
}
