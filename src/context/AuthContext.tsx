import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import { authApi } from '../services/authApi';
import { LoginFormValues, RegisterFormValues } from '../validations/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginFormValues) => Promise<User>;
  register: (data: RegisterFormValues) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mediqo_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Validate persisted token on boot
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mediqo_token');
      if (storedToken) {
        try {
          const data = await authApi.getMe();
          setUser(data.user);
        } catch (error) {
          console.warn('Persisted auth token invalid or expired:', error);
          localStorage.removeItem('mediqo_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginFormValues): Promise<User> => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem('mediqo_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      return res.user;
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data: RegisterFormValues): Promise<User> => {
    try {
      const { confirmPassword, ...registerPayload } = data;
      const res = await authApi.register(registerPayload);
      localStorage.setItem('mediqo_token', res.token);
      setToken(res.token);
      setUser(res.user);
      toast.success('Registration successful! Welcome to Mediqo.');
      return res.user;
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('mediqo_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
