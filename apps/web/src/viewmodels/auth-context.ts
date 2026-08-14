import { createContext, useContext } from 'react';
import type { User } from '../models/user';

interface AuthState {
  token: string | null;
  user: User | null;
}

export interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
