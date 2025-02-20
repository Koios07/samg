import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Contactanos from './pages/Contactanos';
import Buscar from './pages/Buscar';
import Login from './pages/Login';
import Agregar from './pages/Agregar';
import PrivateRoute from './components/PrivateRoute';
import QRCodePage from './pages/QRCode';
import ArticuloDetalle from './pages/ArticuloDetalle';
import Configuracion from './pages/Configuracion';
import CambiarContrasena from './components/CambiarContraseña';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [articulos, setArticulos] = useState([]);
    const [userId, setUserId] = useState(null);

    // Verificar estado de inicio de sesión y cargar userId desde localStorage
    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(parseInt(storedUserId, 10));
        }
    }, []);

    // Función para obtener artículos desde el servidor
    const fetchArticulos = async () => {
        try {
            const response = await fetch('http://localhost:3001/articulos');
            if (!response.ok) throw new Error('Error en la respuesta de la red');
            const data = await response.json();
            setArticulos(data);
        } catch (error) {
            console.error('Error fetching articulos:', error);
        }
    };

    // Cargar artículos al montar el componente
    useEffect(() => {
        fetchArticulos();
    }, []);

    // Manejar inicio de sesión
    const handleLogin = (userId) => {
        setIsLoggedIn(true);
        setUserId(userId);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
    };

    // Manejar cierre de sesión
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userId');
    };

    return (
        <Router>
            <div className="App">
                {/* Barra de navegación */}
                <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
                <div className="container">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                        <Route path="/contactanos" element={<Contactanos />} />
                        <Route path="/buscar" element={<Buscar articulos={articulos} isLoggedIn={isLoggedIn} />} />

                        {/* Ruta para login */}
                        <Route 
                            path="/login" 
                            element={
                                isLoggedIn ? (
                                    <Navigate to="/" replace /> // Redirigir a Home si está logueado
                                ) : (
                                    <Login onLogin={handleLogin} />
                                )
                            } 
                        />

                        {/* Rutas privadas */}
                        <Route 
                            path="/configuracion" 
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn}>
                                    <Configuracion userId={userId} />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/configuracion/cambiarcontrasena" 
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn}>
                                    <CambiarContrasena userId={userId} />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/agregar" 
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn}>
                                    <Agregar />
                                </PrivateRoute>
                            } 
                        />

                        {/* Otras rutas */}
                        <Route 
                            path="/qr/:id_articulo" 
                            element={<QRCodePage articulos={articulos} />} 
                        />
                        <Route 
                            path="/articulo/:id_articulo" 
                            element={
                                isLoggedIn ? (
                                    <ArticuloDetalle 
                                        onUpdateArticulo={(updatedArticulo) => {
                                            setArticulos((prevArticulos) =>
                                                prevArticulos.map((articulo) =>
                                                    articulo.id_articulo === updatedArticulo.id_articulo ? updatedArticulo : articulo
                                                )
                                            );
                                        }} 
                                        isLoggedIn={isLoggedIn} 
                                    />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            } 
                        />

                        {/* Ruta por defecto para redirigir a Home si no se encuentra la ruta */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
