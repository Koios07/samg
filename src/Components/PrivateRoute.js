// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isLoggedIn }) => {
    // Si el usuario no está logueado, redirige a /login
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Permite el acceso a la ruta si el usuario está logueado
    return children;
};

export default PrivateRoute;
