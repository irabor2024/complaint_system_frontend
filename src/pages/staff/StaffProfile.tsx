import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export default function StaffProfile() {
  const { userName } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <Card className="shadow-sm max-w-md">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold text-foreground">{userName}</p>
            <p className="text-sm text-muted-foreground">Staff · Emergency Department</p>
            <p className="text-sm text-muted-foreground">sarah.chen@hospital.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
