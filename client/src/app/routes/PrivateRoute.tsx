import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@app/providers/hooks/useAuth';
import { Loader } from '@shared/ui';

const PrivateRoute = () => {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) return <Loader />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
