import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Chat from './components/Chat/Chat';
import Auth from './pages/Authentication/Auth';
import Layout from './components/Layout/Layout';
import PrivateRoute from './hoc/PrivateRoute';
import useAuth from './hooks/useAuth';
import Main from './pages/Main/Main';

const AppRoutes = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        <Routes>
            <Route path='/auth' element={isAuthenticated ? <Navigate to='/' /> : <Auth />} />
            <Route element={<PrivateRoute />}>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Main />} />
                    <Route path='chat' element={<Chat />} />
                </Route>
            </Route>
            <Route path='*' element={isAuthenticated ? <Navigate to='/' /> : <Navigate to='/auth' />} />
        </Routes>
    )
};

export default AppRoutes;
