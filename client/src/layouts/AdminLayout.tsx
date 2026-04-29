import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, FileText, Building2, Users, BarChart3, Settings, Activity, Moon, Sun, User,
} from 'lucide-react';

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'All Complaints', url: '/admin/complaints', icon: FileText },
  { title: 'Departments', url: '/admin/departments', icon: Building2 },
  { title: 'Staff Management', url: '/admin/staff', icon: Users },
  { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
  { title: 'Profile', url: '/admin/profile', icon: User },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-bold text-foreground">SmartCare</span>}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminLayout() {
  const { user } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user?.name ?? 'Admin'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize hidden sm:inline-flex">{user?.role ?? '—'}</Badge>
              <NotificationDropdown />
              <Button variant="ghost" size="icon" onClick={toggle}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
