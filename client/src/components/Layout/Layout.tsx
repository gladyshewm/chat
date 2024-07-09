import React, { Suspense } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import CustomButton from '../CustomButton/CustomButton';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';
import CustomLoader from '../CustomLoader/CustomLoader';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
    navigate('/auth');
  };

  return (
    <div className="layout">
      <Sidebar />
      <Suspense fallback={<CustomLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
