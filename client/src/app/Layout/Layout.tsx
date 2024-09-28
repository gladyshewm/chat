import { Suspense } from 'react';
import './Layout.css';
import { Outlet } from 'react-router-dom';
import { Loader } from '../../shared/ui';
import { ProfileProvider } from '../providers';
import { Sidebar } from '@widgets';

const Layout = () => {
  return (
    <div className="layout">
      <ProfileProvider>
        <Sidebar />
      </ProfileProvider>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default Layout;
