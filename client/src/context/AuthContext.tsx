import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Role } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const mockUsers: Record<Role, User> = {
  patient: { id: 'user-1', name: 'John Patient', email: 'patient@hospital.com', role: 'patient' },
  staff: { id: 'staff-1', name: 'Dr. Sarah Chen', email: 'staff@hospital.com', role: 'staff', department: 'Emergency' },
  admin: { id: 'admin-1', name: 'Admin User', email: 'admin@hospital.com', role: 'admin' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise(r => setTimeout(r, 500));
    if (email.includes('admin')) { setUser(mockUsers.admin); return true; }
    if (email.includes('staff')) { setUser(mockUsers.staff); return true; }
    setUser(mockUsers.patient);
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const switchRole = useCallback((role: Role) => setUser(mockUsers[role]), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
