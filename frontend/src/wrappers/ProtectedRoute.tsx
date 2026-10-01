import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to='/' />;

  return <Outlet />;
}

export default ProtectedRoute;
