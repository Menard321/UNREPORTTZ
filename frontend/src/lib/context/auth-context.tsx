'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import {
  authService,
  LoginPayload,
  RegisterPayload,
  SetupProfilePayload,
  ResetPasswordPayload,
} from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  verifyEmail: (token?: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  setupProfile: (payload: SetupProfilePayload) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('unireport_auth_token') : null;
        const stored = typeof window !== 'undefined' ? localStorage.getItem('unireport_user') : null;
        
        if (token && stored) {
          setUser(JSON.parse(stored));
        } else if (token) {
          const current = await authService.getCurrentUser();
          setUser(current);
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('unireport_user');
          }
        }
      } catch {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('unireport_auth_token');
          localStorage.removeItem('unireport_user');
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (payload: LoginPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await authService.verifyEmail(token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async (email: string): Promise<void> => {
    await authService.resendVerification(email);
  };

  const setupProfile = async (payload: SetupProfilePayload): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await authService.setupProfile(payload);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    await authService.forgotPassword(email);
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    await authService.resetPassword(payload);
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('unireport_auth_token');
      localStorage.removeItem('unireport_user');
      window.location.href = '/';
    }
    authService.logout().catch(() => {});
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('unireport_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        verifyEmail,
        resendVerification,
        setupProfile,
        forgotPassword,
        resetPassword,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
