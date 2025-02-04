// src/App.js
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [articulos, setArticulos] = useState([]);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

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

    useEffect(() => {
        fetchArticulos();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
    };

    const addArticulo = (nuevoArticulo) => {
        setArticulos((prevArticulos) => [...prevArticulos, nuevoArticulo]);
    };

    // Función para actualizar un artículo
    const updateArticulo = (updatedArticulo) => {
        setArticulos((prevArticulos) =>
            prevArticulos.map((articulo) =>
                articulo.id_articulo === updatedArticulo.id_articulo ? updatedArticulo : articulo
            )
        );
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
                        <Route path="/buscar" element={<Buscar articulos={articulos} isLoggedIn={isLoggedIn} />} />
                        <Route 
                            path="/login" 
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn}>
                                    <Login onLogin={handleLogin} />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/agregar" element={<Agregar onAddArticulo={addArticulo} />} /> 
                        <Route path="/qr/:id_articulo" element={<QRCodePage articulos={articulos} />} />
                        {/* Pasar la función updateArticulo al componente ArticuloDetalle */}
                        <Route path="/articulo/:id_articulo" element={<ArticuloDetalle onUpdateArticulo={updateArticulo} isLoggedIn={isLoggedIn} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
