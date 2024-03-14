// Root.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import SideNavigation from "../navigation/SideNavigation";

const Root: React.FC = () => {
    const isAuthenticated = localStorage.getItem('jwt');
    if (!isAuthenticated) {
        return <Navigate to="/register" replace />;
    }
    return (
        <div className="h-screen flex">
            <SideNavigation />
            <div className="flex-grow bg-transparent overflow-auto">
                <Outlet /> {/* This will render the nested routes */}
            </div>
        </div>
    );
};

export default Root;
