// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isLoggedIn }) => {
  // Si el usuario está logueado, redirige a la página principal
  return isLoggedIn ? <Navigate to="/" /> : children; // Permitir acceso solo si no está logueado
};

export default PrivateRoute;
