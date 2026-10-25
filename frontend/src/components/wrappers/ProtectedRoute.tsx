import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';
import LoadingPage from '@/components/common/LoadingPage';

function ProtectedRoute() {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) return <LoadingPage />;

  if (isError || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
