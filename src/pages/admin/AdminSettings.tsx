import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';

export default function AdminSettings() {
  const { isDark, toggleDark } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <Card className="shadow-sm max-w-xl">
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">Toggle dark theme</p>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleDark} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive email updates for complaints</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-assign Complaints</Label>
              <p className="text-xs text-muted-foreground">Automatically assign to available staff</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
