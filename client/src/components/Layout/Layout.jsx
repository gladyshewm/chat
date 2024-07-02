import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../../components/CustomButton/CustomButton";
import Sidebar from "../Sidebar/Sidebar";
import './Layout.css';

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <div className="layout">
            <Sidebar />
            <CustomButton onClick={handleLogout} type="submit">Выйти</CustomButton>
            HUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUIHUI

            <Outlet />
        </div>
    )
};

export default Layout;
