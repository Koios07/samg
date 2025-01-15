// src/components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isLoggedIn }) => {
  return (
    <Route
      element={isLoggedIn ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
