import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { authApi, type AuthUserDto, setToken, getToken } from '@/services/api';
import { ApiRequestError } from '@/lib/apiClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
}

function mapUser(dto: AuthUserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
    ...(dto.phone ? { phone: dto.phone } : {}),
    ...(dto.departmentId ? { departmentId: dto.departmentId } : {}),
    ...(dto.jobTitle ? { jobTitle: dto.jobTitle } : {}),
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsHydrating(false);
      return;
    }
    authApi
      .me()
      .then(d => setUser(mapUser(d)))
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsHydrating(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      setToken(data.token);
      setUser(mapUser(data.user));
      return { ok: true as const };
    } catch (e) {
      const message = e instanceof ApiRequestError ? e.message : 'Unable to sign in';
      return { ok: false as const, message };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isHydrating,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
