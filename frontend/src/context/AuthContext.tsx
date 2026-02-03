import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import type { AuthResponse } from '../api/auth';

interface User {
  id: number;
  login: string;
  discount: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (login: string, password: string, discount?: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя из localStorage при монтировании компонента
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

  const login = async (login: string, password: string) => {
    try {
      const response = await authApi.login({ login, password });
      handleAuthResponse(response);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка входа';
      throw new Error(message);
    }
  };

  const register = async (login: string, password: string, discount?: number) => {
    try {
      const response = await authApi.register({ login, password, discount });
      handleAuthResponse(response);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      throw new Error(message);
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