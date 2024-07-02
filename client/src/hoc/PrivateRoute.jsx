import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return (
        isAuthenticated ? <Outlet /> : <Navigate to="/auth" />
    );
};

export default PrivateRoute;
