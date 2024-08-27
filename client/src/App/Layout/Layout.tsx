import React, { Suspense } from 'react';
import './Layout.css';
import { Outlet } from 'react-router-dom';
import { Loader } from '../../shared/ui';
import { FullScreenProvider, ProfileProvider } from '../providers';
import { FullScreenSlider } from '@shared/ui/Slider';
import { Sidebar } from '@widgets';

const Layout = () => {
  return (
    <div className="layout">
      <ProfileProvider>
        <FullScreenProvider>
          <Sidebar />
          <FullScreenSlider />
        </FullScreenProvider>
      </ProfileProvider>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
