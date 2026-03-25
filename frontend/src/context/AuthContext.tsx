import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import type { AuthResponse, RegisterData } from '../api/auth';

interface User {
  id: number;
  discount: number;
  balance: number;
  isActive: boolean;
  entityType: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      handleAuthResponse(response);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка входа';
      throw new Error(message);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      handleAuthResponse(response);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      throw new Error(message);
    }
  };

  const refreshProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      const updatedUser: User = {
        id: profile.id,
        discount: profile.discount,
        balance: profile.balance,
        isActive: profile.isActive,
        entityType: profile.entityType,
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
        createdAt: profile.createdAt,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};