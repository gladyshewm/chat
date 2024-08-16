import React, { lazy } from 'react';
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Auth from '../pages/Authentication/Auth';
import PrivateRoute from '../hoc/PrivateRoute/PrivateRoute';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout/Layout';
import CustomLoader from '../components/CustomLoader/CustomLoader';
const Main = lazy(() => import('../pages/Main/Main'));
const Chat = lazy(() => import('../pages/Chat/Chat'));

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
      {loadingStates.checkAuth && <CustomLoader key={`loader-${Date.now()}`} />}
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
