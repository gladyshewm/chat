import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@app/providers/hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};

export default PrivateRoute;
