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
  const { isAuthenticated, authChecked } = useAuth();

  const routes = [
    {
      path: '/auth',
      element: !authChecked ? (
        <Loader />
      ) : !isAuthenticated ? (
        <Auth />
      ) : (
        <Navigate to="/" replace />
      ),
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
      element: !authChecked ? (
        <Loader />
      ) : isAuthenticated ? (
        <Navigate to="/" replace />
      ) : (
        <Navigate to="/auth" replace />
      ),
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default AppRouter;
