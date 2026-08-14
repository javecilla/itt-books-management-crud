import { useCallback } from 'react';
import type { Assignment, CreateAssignmentInput } from '../models/assignment';
import { apiFetch } from '../services/api';
import { useAuth } from './auth-context';

export function useAssignBook() {
  const { token } = useAuth();

  return useCallback(
    async (input: CreateAssignmentInput) => {
      if (!token) return;

      return apiFetch<Assignment>(
        '/assignments',
        { method: 'POST', body: JSON.stringify(input) },
        token,
      );
    },
    [token],
  );
}
