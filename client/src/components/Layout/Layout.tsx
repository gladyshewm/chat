import React, { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import CustomButton from '../CustomButton/CustomButton';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout: FC = () => {
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
      <CustomButton onClick={handleLogout} type="submit">
        Выйти
      </CustomButton>
      HUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUI
      <Outlet />
    </div>
  );
};

export default Layout;
