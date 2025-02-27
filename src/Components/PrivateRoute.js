// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, children, userType, allowedTypes }) => {
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (allowedTypes && !allowedTypes.includes(userType)) {
        return <Navigate to="/" replace />; // Redirige si no tiene acceso
    }

    return children;
};

export default PrivateRoute;
