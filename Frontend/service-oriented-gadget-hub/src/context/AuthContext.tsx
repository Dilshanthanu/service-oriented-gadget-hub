import React, { createContext, useContext, useState, useMemo } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_ENDPOINTS } from '../utils/urls';
import { Role, User } from '../services/api';
import { decodeToken, getUserRoleFromToken } from '../utils/jwtHelper';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================================
   🔐 SINGLE SOURCE OF TRUTH
========================================= */
const buildUserFromToken = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = decodeToken(token);
    const role = getUserRoleFromToken(token);

    if (!payload || !role) return null;

    return {
      id: payload.id || payload.sub || '0',
      email: payload.email || payload.sub || '',
      name: payload.name || payload.unique_name || 'User',
      username: payload.name || payload.unique_name || 'User',
      role: role.toLowerCase() as Role,
    };
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => buildUserFromToken());

  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token } = res.data;

      if (!token) throw new Error('No token received');

      localStorage.setItem('token', token);

      const hydratedUser = buildUserFromToken();
      if (!hydratedUser) {
        throw new Error('Failed to hydrate user');
      }

      setUser(hydratedUser);
      return hydratedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log('Google login not implemented');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      isLoading,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
