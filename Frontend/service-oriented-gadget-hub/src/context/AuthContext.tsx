import React, { createContext, useContext, useEffect, useState } from 'react';
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
  loginWithGoogle: () => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUserFromToken = (token: string, emailFallback?: string): User | null => {
      try {
        const decodedRole = getUserRoleFromToken(token);
        const payload = decodeToken(token);
        
        console.log('[AuthContext] Hydrating user. Payload:', payload, 'Raw Role:', decodedRole);

        if (!payload || !decodedRole) {
           console.warn('[AuthContext] Failed to extract payload or role.');
           return null;
        }
        
        const normalizedRole = decodedRole.toLowerCase() as Role;
        console.log('[AuthContext] Normalized Role:', normalizedRole);

        const email = payload.email || payload.sub || emailFallback || '';
        const name = payload.name || payload.unique_name || email.split('@')[0] || 'User';
        const id = payload.id || payload.sub || '0';

        return { 
          id,
          email, 
          name,
          role: normalizedRole,
          username: name
        };
      } catch (e) {
        console.error("Failed to hydrate user", e);
        return null;
      }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const email = localStorage.getItem('email') || undefined;
        const restoredUser = hydrateUserFromToken(token, email);
        if (restoredUser) {
            setUser(restoredUser);
        } else {
            localStorage.clear();
        }
    }
    setIsLoading(false);
  }, []);

  const login = async ({ email, password }: LoginCredentials): Promise<User> => {
    const res = await axiosInstance.post(API_ENDPOINTS.LOGIN, { email, password });

    const { token } = res.data;
    if (!token) throw new Error('Invalid login response: No token received');

    localStorage.setItem('token', token);
    
    // We can rely on token for everything now
    const userData = hydrateUserFromToken(token, email);
    if (!userData) {
         throw new Error('Failed to decode token after login');
    }

    localStorage.setItem('role', userData.role);
    localStorage.setItem('email', userData.email);

    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async (): Promise<User> => {
    const res = await axiosInstance.post(API_ENDPOINTS.GOOGLE_LOGIN);
    const { token, email } = res.data; 

    if (!token) throw new Error('Invalid login response');

    localStorage.setItem('token', token);

    const userData = hydrateUserFromToken(token, email);
    if (!userData) throw new Error('Failed to decode token');

    localStorage.setItem('role', userData.role);
    localStorage.setItem('email', email);

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
