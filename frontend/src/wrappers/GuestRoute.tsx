import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Navigate to='/dashboard' />;

  return <Outlet />;
}

export default GuestRoute;
