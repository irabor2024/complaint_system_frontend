import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import { ApiRequestError } from '@/lib/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function TwoFactorSettingsSection() {
  const { user, refreshUser } = useAuth();
  const [enrollUrl, setEnrollUrl] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [enrollCode, setEnrollCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const enabled = Boolean(user?.twoFactorEnabled);

  const startEnroll = async () => {
    setBusy(true);
    try {
      const { otpAuthUrl, manualEntryKey } = await authApi.twoFactorSetupInit();
      setEnrollUrl(otpAuthUrl);
      setManualKey(manualEntryKey);
      setEnrollCode('');
      toast.message('Scan the QR code with your authenticator app, then enter a code to confirm.');
    } catch (e) {
      toast.error(e instanceof ApiRequestError ? e.message : 'Could not start 2FA setup');
    } finally {
      setBusy(false);
    }
  };

  const completeEnroll = async () => {
    setBusy(true);
    try {
      await authApi.twoFactorSetupComplete(enrollCode.replace(/\s/g, ''));
      setEnrollUrl(null);
      setManualKey(null);
      setEnrollCode('');
      await refreshUser();
      toast.success('Two-factor authentication is enabled.');
    } catch (e) {
      toast.error(e instanceof ApiRequestError ? e.message : 'Invalid code');
    } finally {
      setBusy(false);
    }
  };

  const cancelEnroll = () => {
    setEnrollUrl(null);
    setManualKey(null);
    setEnrollCode('');
  };

  const confirmDisable = async () => {
    setBusy(true);
    try {
      await authApi.twoFactorDisable(disablePassword);
      setDisableOpen(false);
      setDisablePassword('');
      await refreshUser();
      toast.success('Two-factor authentication has been turned off.');
    } catch (e) {
      toast.error(e instanceof ApiRequestError ? e.message : 'Could not disable 2FA');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2 shrink-0">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-foreground">Two-factor authentication (TOTP)</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, etc.) for a second step
            after your password at sign-in.
          </p>
        </div>
      </div>

      {enabled ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          <p className="text-sm text-foreground">
            Status: <span className="font-medium text-green-600 dark:text-green-400">On</span>
          </p>
          <Button type="button" variant="outline" className="rounded-xl shrink-0" onClick={() => setDisableOpen(true)}>
            Turn off 2FA
          </Button>
        </div>
      ) : enrollUrl && manualKey ? (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-xl bg-white p-3 border border-border">
              <QRCode value={enrollUrl} size={168} level="M" />
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              Or enter this key manually:{' '}
              <span className="font-mono text-foreground break-all select-all">{manualKey}</span>
            </p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="2fa-enroll-code" className="text-sm font-medium text-foreground">6-digit code</label>
            <Input
              id="2fa-enroll-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={12}
              value={enrollCode}
              onChange={e => setEnrollCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="rounded-xl font-mono tracking-widest text-center"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button type="button" variant="ghost" className="rounded-xl" disabled={busy} onClick={cancelEnroll}>
              Cancel
            </Button>
            <Button type="button" className="rounded-xl" disabled={busy || enrollCode.length < 6} onClick={() => void completeEnroll()}>
              Confirm and enable
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="secondary" className="rounded-xl w-full sm:w-auto" disabled={busy} onClick={() => void startEnroll()}>
          Set up authenticator app
        </Button>
      )}

      <AlertDialog open={disableOpen} onOpenChange={setDisableOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Turn off two-factor authentication?</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your account password to confirm. You can set up 2FA again later from this page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-1.5 py-2">
            <label htmlFor="2fa-disable-pw" className="text-sm font-medium text-foreground">Password</label>
            <Input
              id="2fa-disable-pw"
              type="password"
              autoComplete="current-password"
              value={disablePassword}
              onChange={e => setDisablePassword(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={busy}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="rounded-xl"
              disabled={busy || !disablePassword}
              onClick={() => void confirmDisable()}
            >
              Turn off 2FA
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
