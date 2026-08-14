import { useCallback, useEffect, useState } from 'react';
import type { Assignment, CreateAssignmentInput } from '../models/assignment';
import { apiFetch } from '../services/api';
import { useAuth } from './auth-context';

export function useAssignments() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMyAssignments = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<Assignment[]>('/assignments/mine', {}, token);
      setAssignments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadMyAssignments();
  }, [loadMyAssignments]);

  const assignBook = useCallback(
    async (input: CreateAssignmentInput) => {
      if (!token) return;

      await apiFetch<Assignment>(
        '/assignments',
        { method: 'POST', body: JSON.stringify(input) },
        token,
      );
    },
    [token],
  );

  return { assignments, loading, error, loadMyAssignments, assignBook };
}
