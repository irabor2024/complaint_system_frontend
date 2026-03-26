import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { Bell, Moon, Sun, Menu, X, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { role, isDark, toggleDark } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">SmartCare</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {isLanding && (
            <div className="flex items-center gap-2">
              <Link to="/submit-complaint">
                <Button size="sm">Submit Complaint</Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" size="sm">Track Complaint</Button>
              </Link>
            </div>
          )}
          <RoleSwitcher />
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {role !== 'patient' && (
            <Link to={role === 'staff' ? '/staff' : '/admin'}>
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 space-y-3">
          <RoleSwitcher />
          <div className="flex flex-col gap-2">
            <Link to="/submit-complaint" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" size="sm">Submit Complaint</Button>
            </Link>
            <Link to="/track" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full" size="sm">Track Complaint</Button>
            </Link>
            {role !== 'patient' && (
              <Link to={role === 'staff' ? '/staff' : '/admin'} onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full" size="sm">Dashboard</Button>
              </Link>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={toggleDark} className="w-full justify-start">
            {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      )}
    </nav>
  );
}
