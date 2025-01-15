// src/App.js
import React, { useState } from 'react';
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

  const handleLogin = () => {
    setIsLoggedIn(true); // Cambiar estado a logueado
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Cambiar estado a no logueado
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
            {/* Ruta privada para Login */}
            <PrivateRoute path="/login" element={<Login onLogin={handleLogin} />} isLoggedIn={isLoggedIn} /> 
            {/* Puedes agregar más rutas privadas aquí usando PrivateRoute */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
