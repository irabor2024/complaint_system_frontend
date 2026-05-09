import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Menu, X, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const role = user?.role ?? 'patient';

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SmartCare</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {isLanding && (
            <div className="flex items-center gap-2">
              <Link to="/submit">
                <Button size="sm">Submit Complaint</Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" size="sm">Track Complaint</Button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <Badge variant="secondary" className="capitalize">
              {role}
            </Badge>
          )}
          <Button variant="ghost" size="icon" onClick={toggle}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {isAuthenticated && (
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          )}
          {!isAuthenticated && (
            <Link to="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          {isAuthenticated && (
            <div className="flex items-center gap-2 pb-2">
              <Badge variant="secondary" className="capitalize">{role}</Badge>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Link to="/submit" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" size="sm">Submit Complaint</Button>
            </Link>
            <Link to="/track" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">Track Complaint</Button>
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">Dashboard</Button>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">Sign in</Button>
              </Link>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggle} className="w-full justify-start">
            {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      )}
    </nav>
  );
}
