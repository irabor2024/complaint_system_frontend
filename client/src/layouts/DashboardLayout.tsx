import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Footer } from '@/components/Footer';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { notificationService } from '@/services/api';
import { Role } from '@/types';
import {
  LayoutDashboard, FileText, Search, PlusCircle, Users, Building2, BarChart3,
  Bell, Sun, Moon, Menu, X, LogOut, ClipboardList, Eye, User, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const navItems: Record<Role, { label: string; path: string; icon: React.ElementType }[]> = {
  patient: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Complaints', path: '/dashboard/complaints', icon: FileText },
    { label: 'Submit Complaint', path: '/dashboard/submit', icon: PlusCircle },
    { label: 'Track Complaint', path: '/dashboard/track', icon: Eye },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ],
  staff: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Complaints', path: '/dashboard/assigned', icon: ClipboardList },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', path: '/dashboard/complaints', icon: FileText },
    { label: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Departments', path: '/dashboard/departments', icon: Building2 },
    { label: 'Staff', path: '/dashboard/staff', icon: Users },
    { label: 'Profile', path: '/dashboard/profile', icon: User },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const role = user?.role || 'patient';
  const items = navItems[role];

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getAll,
  });
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications-unread'],
    queryFn: notificationService.getUnreadCount,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!notifOpen) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (!notifRef.current) return;
      if (!notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [notifOpen]);

  return (
    <div className="dashboard-shell min-h-screen flex bg-gradient-to-br from-blue-50 via-background to-purple-50/40 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[min(100%,18rem)] sm:w-64 bg-gradient-to-b from-blue-600 via-blue-600 to-indigo-600 text-white border-r border-white/15 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="p-4 border-b border-white/15 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 min-w-0" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 shrink-0 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white truncate">SmartCare</span>
          </Link>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-xl text-white hover:text-white hover:bg-white/10 lg:hidden" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-white text-[#2f5fc2] shadow' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/15">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur px-3 sm:px-4 py-2 sm:py-0 sm:h-16 flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1 min-w-0 w-full order-2 sm:order-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input placeholder="Search..." className="pl-9 h-9 rounded-xl bg-card border border-border w-full text-sm" />
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto order-1 sm:order-2">
            <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="ml-auto flex items-center gap-1 sm:gap-2 min-w-0">
              <Badge variant="secondary" className="hidden sm:inline-flex capitalize text-xs shrink-0">
                {role}
              </Badge>
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0" onClick={toggle}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <div ref={notifRef} className="relative shrink-0 ml-1 sm:ml-2">
                <Button variant="ghost" size="icon" className="rounded-xl relative bg-card border border-border hover:bg-accent" onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
                {notifOpen && (
                  <div
                    className="fixed inset-x-3 top-[4.5rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-1 w-auto sm:w-80 sm:max-w-sm bg-card border border-border rounded-xl shadow-lg z-50 max-h-[min(24rem,70vh)] overflow-y-auto"
                    onClick={() => setNotifOpen(false)}
                  >
                    <div className="p-3 border-b border-border font-semibold text-sm">Notifications</div>
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-border last:border-0 text-sm ${!n.read ? 'bg-accent/50' : ''}`}>
                          <div className="font-medium text-foreground break-words">{n.title}</div>
                          <p className="text-muted-foreground text-xs mt-0.5 break-words">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="relative flex items-center gap-2 pl-2 border-l border-border shrink-0 min-w-0">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl px-1 py-0.5 hover:bg-accent transition-colors"
                  onClick={() => setUserMenuOpen(prev => !prev)}
                >
                  <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden md:inline truncate max-w-[10rem] lg:max-w-xs">{user?.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-card shadow-lg z-50 py-1">
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                      onClick={() => { setUserMenuOpen(false); navigate('/dashboard/profile'); }}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent transition-colors"
                      onClick={() => { setUserMenuOpen(false); navigate('/dashboard/settings'); }}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-destructive hover:bg-accent transition-colors"
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 w-full min-w-0 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
