import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import CustomLoader from '../CustomLoader/CustomLoader';
import './Layout.css';

const Layout = () => {
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
