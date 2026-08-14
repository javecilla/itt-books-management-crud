import { useAuth } from '../viewmodels/auth-context';
import { useAssignments } from '../viewmodels/useAssignments';

export function StudentBooksView() {
  const { user, logout } = useAuth();
  const { assignments, loading, error } = useAssignments();

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>My Assigned Books</h1>
          <p className="muted">Signed in as {user?.username}</p>
        </div>
        <button type="button" className="secondary" onClick={logout}>
          Log out
        </button>
      </header>

      <section className="card">
        {loading && <p className="muted">Loading your books…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && assignments.length === 0 && (
          <p className="muted">No books have been assigned to you yet.</p>
        )}

        <div className="book-grid">
          {assignments.map((assignment) => {
            const book = assignment.book;
            if (!book) return null;

            return (
              <article key={assignment.id} className="book-card">
                <img src={book.coverImage} alt={book.title} />
                <div className="book-body">
                  <h3>{book.title}</h3>
                  <p>{book.description}</p>
                  <p className="hint">
                    Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
