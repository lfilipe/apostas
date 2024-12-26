import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextData {
  user: User | null;
  signIn: (token: string, userData: User) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@SuperApostas:user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('@SuperApostas:token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const signIn = (token: string, userData: User) => {
    localStorage.setItem('@SuperApostas:token', token);
    localStorage.setItem('@SuperApostas:user', JSON.stringify(userData));
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('@SuperApostas:token');
    localStorage.removeItem('@SuperApostas:user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 