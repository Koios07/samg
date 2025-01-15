// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Contactanos from './pages/Contactanos';
import Buscar from './pages/Buscar';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Importa PrivateRoute

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está logueado

  // Efecto para cargar el estado de autenticación desde localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Verifica el estado en localStorage
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true); // Cambiar estado a logueado
    localStorage.setItem('isLoggedIn', 'true'); // Guardar en localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Cambiar estado a no logueado
    localStorage.setItem('isLoggedIn', 'false'); // Actualizar en localStorage
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/buscar" element={<Buscar />} />
            {/* Usar PrivateRoute para proteger la ruta de Login */}
            <Route 
              path="/login" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Login onLogin={handleLogin} />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
