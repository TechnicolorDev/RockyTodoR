import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: JSX.Element;
    path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, ...rest }) => {
    // Check if the user is authenticated
    const isAuthenticated = !!sessionStorage.getItem('adminId'); // Check if `adminId` exists in sessionStorage

    // If not authenticated, redirect to login page, else render the protected component
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
