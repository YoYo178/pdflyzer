import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function GuestRoute() {
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) return <h1>Loading...</h1>; // TODO

  if (isError) return <Navigate to='/' replace />;

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Outlet />;
}

export default GuestRoute;