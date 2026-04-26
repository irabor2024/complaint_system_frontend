import { Mail, Phone, Shield, UserCircle2 } from 'lucide-react';
import AnimatedPage from '@/components/AnimatedPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Your account details and how you appear across the admin console.
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <UserCircle2 className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{user?.name ?? 'Administrator'}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  System administrator
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Display Name</label>
                <Input defaultValue={user?.name ?? ''} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Work Email</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input defaultValue={user?.email ?? ''} className="rounded-xl pl-9" />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-foreground">Work Phone</label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input defaultValue="+1-000-000-0000" className="rounded-xl pl-9" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="rounded-xl">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}
