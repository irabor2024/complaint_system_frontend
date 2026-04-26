import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { mockNotifications } from '@/mock-data/notifications';
import { Role } from '@/types';
import {
  LayoutDashboard, FileText, Search, PlusCircle, Users, Building2, BarChart3,
  Bell, Sun, Moon, Menu, X, LogOut, ChevronDown, ClipboardList, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const navItems: Record<Role, { label: string; path: string; icon: React.ElementType }[]> = {
  patient: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Submit Complaint', path: '/dashboard/submit', icon: PlusCircle },
    { label: 'Track Complaint', path: '/dashboard/track', icon: Eye },
  ],
  staff: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Complaints', path: '/dashboard/assigned', icon: ClipboardList },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', path: '/dashboard/complaints', icon: FileText },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Departments', path: '/dashboard/departments', icon: Building2 },
    { label: 'Staff', path: '/dashboard/staff', icon: Users },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, switchRole } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const role = user?.role || 'patient';
  const items = navItems[role];
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">SmartCare</span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-3 sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 h-9 rounded-xl bg-muted border-0" />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Role Switcher */}
            <div className="relative">
              <Button variant="outline" size="sm" className="rounded-xl gap-1 text-xs" onClick={() => setRoleMenuOpen(!roleMenuOpen)}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
                <ChevronDown className="w-3 h-3" />
              </Button>
              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                  {(['patient', 'staff', 'admin'] as Role[]).map(r => (
                    <button key={r} onClick={() => { switchRole(r); setRoleMenuOpen(false); navigate('/dashboard'); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors ${r === role ? 'text-primary font-medium' : 'text-foreground'}`}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="ghost" size="icon" className="rounded-xl" onClick={toggle}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-xl relative" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border font-semibold text-sm">Notifications</div>
                  {mockNotifications.map(n => (
                    <div key={n.id} className={`p-3 border-b border-border last:border-0 text-sm ${!n.read ? 'bg-accent/50' : ''}`}>
                      <div className="font-medium text-foreground">{n.title}</div>
                      <p className="text-muted-foreground text-xs mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
