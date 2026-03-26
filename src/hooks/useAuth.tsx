import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role } from '@/types';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
  isDark: boolean;
  toggleDark: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: 'patient',
  setRole: () => {},
  userName: 'Guest',
  isDark: false,
  toggleDark: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('patient');
  const [isDark, setIsDark] = useState(false);

  const setRole = useCallback((r: Role) => setRoleState(r), []);

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const userName = role === 'patient' ? 'Guest Patient' : role === 'staff' ? 'Dr. Sarah Chen' : 'Admin Thomas';

  return (
    <AuthContext.Provider value={{ role, setRole, userName, isDark, toggleDark }}>
      {children}
    </AuthContext.Provider>
  );
};
