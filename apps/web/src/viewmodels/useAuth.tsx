import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { LoginResponse } from '../models/user';
import { apiFetch } from '../services/api';
import { AuthContext } from './auth-context';

const STORAGE_KEY = 'books_auth';
interface AuthState {
  token: string | null;
  user: LoginResponse['user'] | null;
}

function loadStoredAuth(): AuthState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { token: null, user: null };
  }

  try {
    const parsed = JSON.parse(raw) as AuthState;
    return { token: parsed.token, user: parsed.user };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadStoredAuth);

  const login = useCallback(async (username: string, password: string) => {
    const result = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const next = { token: result.access_token, user: result.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      ...auth,
      login,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user),
    }),
    [auth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
