// import { lazy } from 'react';
/* const Main = lazy(() => import('../../pages/Main/ui/Main'));
const Chat = lazy(() => import('../../pages/Chat/ui/Chat')); */
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Layout from '../Layout/Layout';
import { useAuth } from '@app/providers/hooks/useAuth';
import { Loader } from '@shared/ui';
import { Auth, Chat, Main } from '@pages';

const AppRouter = () => {
  const { isAuthenticated, loadingStates } = useAuth();

  const routes = [
    {
      path: '/auth',
      element: !isAuthenticated ? <Auth /> : <Navigate to="/" />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          element: <Layout />,
          children: [
            {
              index: true,
              element: <Main />,
            },
            {
              path: 'chat/:id',
              element: <Chat />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: isAuthenticated ? <Navigate to="/" /> : <Navigate to="/auth" />,
    },
  ];

  const router = createBrowserRouter(routes);

  return (
    <>
      {loadingStates.checkAuth && <Loader key={`loader-${Date.now()}`} />}
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
