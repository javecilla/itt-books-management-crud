import { useState, type FormEvent } from 'react';
import { useAuth } from '../viewmodels/auth-context';
import { useBooks } from '../viewmodels/useBooks';
import { useStudents } from '../viewmodels/useStudents';
import { useAssignBook } from '../viewmodels/useAssignBook';

export function TeacherDashboardView() {
  const { user, logout } = useAuth();
  const { books, loading, error, createBook } = useBooks();
  const { students, loading: studentsLoading, error: studentsError } = useStudents();
  const assignBook = useAssignBook();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [assigningBookId, setAssigningBookId] = useState<number | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Record<number, number | ''>>({});
  const [assignMessages, setAssignMessages] = useState<Record<number, string>>({});

  async function handleCreateBook(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setCreating(true);

    try {
      await createBook({ title, description, coverImage });
      setTitle('');
      setDescription('');
      setCoverImage('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create book');
    } finally {
      setCreating(false);
    }
  }

  async function handleAssign(bookId: number) {
    const selectedStudentId = selectedStudentIds[bookId];
    if (!selectedStudentId) {
      setAssignMessages((current) => ({ ...current, [bookId]: 'Select a student first.' }));
      return;
    }

    setAssigningBookId(bookId);
    setAssignMessages((current) => ({ ...current, [bookId]: '' }));

    try {
      await assignBook({ bookId, studentId: Number(selectedStudentId) });
      setAssignMessages((current) => ({
        ...current,
        [bookId]: 'Book assigned successfully.',
      }));
      setSelectedStudentIds((current) => ({ ...current, [bookId]: '' }));
    } catch (err) {
      setAssignMessages((current) => ({
        ...current,
        [bookId]: err instanceof Error ? err.message : 'Failed to assign book',
      }));
    } finally {
      setAssigningBookId(null);
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="muted">Signed in as {user?.username}</p>
        </div>
        <button type="button" className="secondary" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="card">
        <h2>Create a book</h2>
        <form onSubmit={handleCreateBook} className="stack grid-2">
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Cover image URL
            <input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              required
            />
          </label>
          <label className="full-width">
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </label>
          {formError && <p className="error full-width">{formError}</p>}
          <div className="full-width">
            <button type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create book'}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Your books</h2>
        {loading && <p className="muted">Loading books…</p>}
        {error && <p className="error">{error}</p>}
        {studentsError && <p className="error">{studentsError}</p>}
        {!loading && books.length === 0 && <p className="muted">No books yet.</p>}

        <div className="book-grid">
          {books.map((book) => (
            <article key={book.id} className="book-card">
              <img src={book.coverImage} alt={book.title} />
              <div className="book-body">
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <div className="assign-row">
                  <select
                    value={selectedStudentIds[book.id] ?? ''}
                    onChange={(e) =>
                      setSelectedStudentIds((current) => ({
                        ...current,
                        [book.id]: e.target.value ? Number(e.target.value) : '',
                      }))
                    }
                    disabled={studentsLoading || students.length === 0 || Boolean(studentsError)}
                  >
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.username}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAssign(book.id)}
                    disabled={
                      assigningBookId === book.id ||
                      !selectedStudentIds[book.id] ||
                      Boolean(studentsError)
                    }
                  >
                    {assigningBookId === book.id ? 'Assigning…' : 'Assign'}
                  </button>
                </div>
                {assignMessages[book.id] && <p className="hint">{assignMessages[book.id]}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
