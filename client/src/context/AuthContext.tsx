import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../../../shared/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr-1',
    email: 'admin@forgemind.ai',
    name: 'R. Kapoor',
    role: 'ADMIN',
    avatar: 'RK',
    createdAt: new Date().toISOString(),
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('forgemind_token') || 'demo-token');
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('forgemind_token', res.data.token);
    } catch (err) {
      console.error('Login failed, using demo user:', err);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('forgemind_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
