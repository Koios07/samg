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
import HerramientaDetalle from './pages/HerramientaDetalle';
import Configuracion from './pages/Configuracion';
import CambiarContrasena from './components/CambiarContraseña';
import GestionarUsuario from './components/GestionarUsuario'; // Importa el componente GestionarUsuario
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [herramientas, setHerramientas] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal

    // Verificar estado de inicio de sesión y cargar datos desde localStorage
    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }

        const storedUserType = localStorage.getItem('userType');
        if (storedUserType) {
            setUserType(storedUserType);
        }
    }, []);

    // Función para obtener artículos desde el servidor
    const fetchHerramientas = async () => {
        try {
            const response = await fetch('http://localhost:3001/herramientas');
            if (!response.ok) throw new Error('Error en la respuesta de la red');
            const data = await response.json();
            setHerramientas(data);
        } catch (error) {
            console.error('Error fetching herramientas:', error);
        }
    };

    // Cargar artículos al montar el componente
    useEffect(() => {
        fetchHerramientas();
    }, []);

    // Manejar inicio de sesión
    const handleLogin = (userId, userType) => {
        if (userType === "3") {
            // Si el usuario es tipo 3, mostrar el modal y no permitir acceso
            setModalMessage('Usuario inactivo. Por favor, comuníquese con el administrador');
            setShowModal(true);
            return;
        }

        // Si es tipo 1 o 2, permitir acceso
        setIsLoggedIn(true);
        setUserId(userId);
        setUserType(userType);

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', userType);
    };

    // Manejar cierre de sesión
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setUserType(null);

        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    return (
        <Router>
            <div className="App">
                {/* Barra de navegación */}
                <NavigationBar isLoggedIn={isLoggedIn} onLogout={handleLogout} userType={userType} />
                <div className="container">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                        <Route path="/contactanos" element={<Contactanos />} />
                        <Route path="/buscar" element={<Buscar herramientas={herramientas} isLoggedIn={isLoggedIn} />} />

                        {/* Ruta para login */}
                        <Route
                            path="/login"
                            element={
                                isLoggedIn ? (
                                    <Navigate to="/" replace />
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
                                    <Configuracion userId={userId} userType={userType} />
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
                         <Route
                            path="/gestionar-usuarios"
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn} userType={userType}>
                                    <GestionarUsuario />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/qr/:id_articulo" element={<QRCodePage herramientas={herramientas} />} />
                        <Route
                            path="/herramienta/:id_articulo"
                            element={
                                isLoggedIn ? (
                                    <HerramientaDetalle
                                        onUpdateHerramienta={(updatedHerramienta) =>
                                            setHerramientas((prevHerramientas) =>
                                                prevHerramientas.map((herramienta) =>
                                                    herramienta.id_articulo === updatedHerramienta.id_articulo ? updatedHerramienta : herramienta
                                                )
                                            )
                                        }
                                        isLoggedIn={isLoggedIn}
                                    />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                {/* Modal personalizado */}
                {showModal && (
                    <div className="modal-backdrop" style={{ display: 'block' }}>
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Información</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>{modalMessage}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
}

export default App;
