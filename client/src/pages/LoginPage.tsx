import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const DEMO_PASSWORD = 'ChangeMe123!';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate('/dashboard');
      return;
    }
    toast.error(result.message);
  };

  const quickLogin = async (role: string) => {
    setLoading(true);
    const result = await login(`${role}@hospital.com`, DEMO_PASSWORD);
    setLoading(false);
    if (result.ok) {
      navigate('/dashboard');
      return;
    }
    toast.error(result.message);
  };

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center bg-muted/30 px-3 py-8 sm:px-4 sm:py-10 md:px-6"
      style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full min-w-0 max-w-[min(100%,24rem)] sm:max-w-md"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="w-full min-w-0 rounded-2xl shadow-lg border-border/80">
          <CardHeader className="text-center space-y-2 sm:space-y-3 px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-2">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-semibold tracking-tight px-1">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm max-w-[280px] sm:max-w-none mx-auto leading-relaxed">
              Sign in to SmartCare Hospital System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 pb-6 pt-0 sm:px-6 sm:pb-8">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium text-foreground">Email</label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hospital.com"
                  className="rounded-xl h-11 sm:h-10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">Password</label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl h-11 sm:h-10"
                  required
                />
              </div>
              <Button type="submit" className="w-full rounded-xl h-11 sm:h-10 touch-manipulation" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative py-0.5">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] sm:text-xs">
                <span className="bg-card px-2 text-muted-foreground">Quick login (seeded API)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-2">
              {['patient', 'staff', 'admin'].map(role => (
                <Button
                  key={role}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs w-full sm:min-w-0 h-10 touch-manipulation"
                  disabled={loading}
                  onClick={() => quickLogin(role)}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>

            <p className="text-center text-[11px] text-muted-foreground">
              Demo accounts use password <span className="font-mono">{DEMO_PASSWORD}</span> after <code className="text-xs">npm run prisma:seed</code> on the API.
            </p>

            <p className="text-center text-xs text-muted-foreground pt-1">
              <Link to="/submit" className="underline underline-offset-2 hover:text-foreground transition-colors">
                File a complaint without signing in
              </Link>
              <span className="mx-2 text-border" aria-hidden>
                ·
              </span>
              <Link to="/" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
