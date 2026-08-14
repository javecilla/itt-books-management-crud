import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './viewmodels/auth-context';
import { AuthProvider } from './viewmodels/useAuth';
import { LoginView } from './views/LoginView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { StudentBooksView } from './views/StudentBooksView';

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: 'TEACHER' | 'STUDENT';
}) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'TEACHER' ? '/teacher' : '/student'} replace />;
  }

  return children;
}

function HomeRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user?.role === 'TEACHER' ? '/teacher' : '/student'} replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <HomeRedirect /> : <LoginView />}
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="TEACHER">
            <TeacherDashboardView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentBooksView />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
