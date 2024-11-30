import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        // If not authenticated, navigate to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, return the child components (the protected route)
    return children;
};

export default ProtectedRoute;