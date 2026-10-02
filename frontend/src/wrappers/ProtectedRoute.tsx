import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) return <h1>Loading...</h1>; // TODO

  if (isError || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;