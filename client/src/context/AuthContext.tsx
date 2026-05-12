import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types';
import { authApi, type AuthUserDto, setToken, getToken } from '@/services/api';
import { ApiRequestError } from '@/lib/apiClient';

export type LoginOutcome =
  | { ok: true }
  | { ok: true; requiresTwoFactor: true; tempToken: string }
  | { ok: false; message: string };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<LoginOutcome>;
  completeTwoFactorLogin: (tempToken: string, code: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

function mapUser(dto: AuthUserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    role: dto.role,
    ...(dto.twoFactorEnabled !== undefined ? { twoFactorEnabled: dto.twoFactorEnabled } : {}),
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

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const d = await authApi.me();
      setUser(mapUser(d));
    } catch {
      /* keep existing session state if /me fails transiently */
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginOutcome> => {
    try {
      const data = await authApi.login(email, password);
      if ('requiresTwoFactor' in data && data.requiresTwoFactor) {
        return { ok: true, requiresTwoFactor: true, tempToken: data.tempToken };
      }
      setToken(data.token);
      setUser(mapUser(data.user));
      return { ok: true };
    } catch (e) {
      const message = e instanceof ApiRequestError ? e.message : 'Unable to sign in';
      return { ok: false, message };
    }
  }, []);

  const completeTwoFactorLogin = useCallback(
    async (tempToken: string, code: string): Promise<{ ok: true } | { ok: false; message: string }> => {
      try {
        const data = await authApi.verifyTwoFactorLogin(tempToken, code);
        setToken(data.token);
        setUser(mapUser(data.user));
        return { ok: true };
      } catch (e) {
        const message = e instanceof ApiRequestError ? e.message : 'Verification failed';
        return { ok: false, message };
      }
    },
    []
  );

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
        completeTwoFactorLogin,
        refreshUser,
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
