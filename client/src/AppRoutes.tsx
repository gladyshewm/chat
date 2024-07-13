import React, { lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Auth from './pages/Authentication/Auth';
import PrivateRoute from './hoc/PrivateRoute';
import useAuth from './hooks/useAuth';
import Layout from './components/Layout/Layout';
import CustomLoader from './components/CustomLoader/CustomLoader';
const Main = lazy(() => import('./pages/Main/Main'));
const Chat = lazy(() => import('./pages/Chat/Chat'));

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <AnimatePresence>
      <Routes>
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/" /> : <Auth />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="chat/:id" element={<Chat />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/auth" />
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
