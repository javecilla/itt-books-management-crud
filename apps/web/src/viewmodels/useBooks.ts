import { useCallback, useEffect, useState } from 'react';
import type { Book, CreateBookInput } from '../models/book';
import { apiFetch } from '../services/api';
import { useAuth } from './auth-context';

export function useBooks() {
  const { token } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<Book[]>('/books', {}, token);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const createBook = useCallback(
    async (input: CreateBookInput) => {
      if (!token) return;

      const created = await apiFetch<Book>(
        '/books',
        { method: 'POST', body: JSON.stringify(input) },
        token,
      );
      setBooks((current) => [created, ...current]);
      return created;
    },
    [token],
  );

  return { books, loading, error, loadBooks, createBook };
}
