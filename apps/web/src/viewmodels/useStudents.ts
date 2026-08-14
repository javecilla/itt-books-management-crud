import { useCallback, useEffect, useState } from 'react';
import type { User } from '../models/user';
import { apiFetch } from '../services/api';
import { useAuth } from './auth-context';

export function useStudents() {
  const { token } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<User[]>('/users/students', {}, token);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadStudents();
  }, [loadStudents]);

  return { students, loading, error, loadStudents };
}
