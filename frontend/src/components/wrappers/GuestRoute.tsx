import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <h1>Loading...</h1>; // TODO

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
