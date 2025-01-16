// src/App.js

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Contactanos from './pages/Contactanos';
import Buscar from './pages/Buscar'; // Asegúrate de importar Buscar
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute'; // Importa PrivateRoute
import QRCodePage from './pages/QRCode'; // Importa el nuevo componente
import ArticuloDetalle from './pages/ArticuloDetalle'; // Importa el nuevo componente para detalles del artículo

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar si el usuario está logueado
  const [articulos, setArticulos] = useState([]); // Estado para almacenar los artículos

  // Efecto para cargar el estado de autenticación desde localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Verifica el estado en localStorage
    setIsLoggedIn(loggedIn);
  }, []);

  // Efecto para obtener artículos desde el backend
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const response = await fetch('http://localhost:3001/articulos'); // Cambia esto a tu endpoint real
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        setArticulos(data); // Almacena los artículos en el estado
      } catch (error) {
        console.error('Error fetching articulos:', error);
      }
    };
    fetchArticulos();
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
            {/* Modifica la ruta de Buscar para pasar los artículos y el estado de autenticación como props */}
            <Route path="/buscar" element={<Buscar articulos={articulos} isLoggedIn={isLoggedIn} />} />
            <Route 
              path="/login" 
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <Login onLogin={handleLogin} />
                </PrivateRoute>
              } 
            />
            {/* Nueva ruta para mostrar el código QR */}
            <Route path="/qr/:id_articulo" element={<QRCodePage articulos={articulos} />} />
            {/* Nueva ruta para mostrar detalles del artículo */}
            <Route path="/articulo/:id_articulo" element={<ArticuloDetalle articulos={articulos} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
