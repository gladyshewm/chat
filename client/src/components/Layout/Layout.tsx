import React, { Suspense } from 'react';
import './Layout.css';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import CustomLoader from '../CustomLoader/CustomLoader';
import FullScreenSlider from '../Slider/FullScreenSlider/FullScreenSlider';
import { FullScreenProvider } from '../../hoc/FullScreen/FullScreenProvider';
import { ProfileProvider } from '../../hoc/Profile/ProfileProvider';

const Layout = () => {
  return (
    <div className="layout">
      <ProfileProvider>
        <FullScreenProvider>
          <Sidebar />
          <FullScreenSlider />
        </FullScreenProvider>
      </ProfileProvider>
      <Suspense fallback={<CustomLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
