import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
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
import CrearUsuario from './components/CrearUsuario';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [herramientas, setHerramientas] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userType, setUserType] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
    const [modalMessage, setModalMessage] = useState(''); // Mensaje del modal
    const [cargando, setCargando] = useState(true); // Estado de carga

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

        const storedNombre = localStorage.getItem('nombre');
        if (storedNombre) {
            setNombre(storedNombre);
        }
    }, []);

    const fetchHerramientas = async () => {
        try {
            const response = await fetch('http://localhost:3001/herramientas');
            if (!response.ok) throw new Error('Error en la respuesta de la red');
            const data = await response.json();
            setHerramientas(data);
            console.log('Herramientas cargadas:', data); // Verifica si se cargan los datos
            setCargando(false); // Cambia el estado de carga a false
        } catch (error) {
            console.error('Error fetching herramientas:', error);
            setCargando(false); // Cambia el estado de carga a false en caso de error
        }
    };

    useEffect(() => {
        fetchHerramientas();
    }, []);

    const handleLogin = (userId, userType, nombre) => {
        setIsLoggedIn(true);
        setUserId(userId);
        setUserType(userType);
        setNombre(nombre);

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', userType);
        localStorage.setItem('nombre', nombre);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserId(null);
        setUserType(null);
        setNombre(null);

        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        localStorage.removeItem('nombre');
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    return (
        <Router>
            <AppContent
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                userType={userType}
                nombre={nombre}
                herramientas={herramientas}
                userId={userId}
                showModal={showModal}
                modalMessage={modalMessage}
                handleCloseModal={handleCloseModal}
                handleLogin={handleLogin}
                cargando={cargando}
            />
        </Router>
    );
}

function AppContent({ isLoggedIn, onLogout, userType, nombre, herramientas, userId, showModal, modalMessage, handleCloseModal, handleLogin, cargando }) {
    const navigate = useNavigate(); // Hook para la navegación

    return (
        <div className="App">
            {/* Barra de navegación */}
            <NavigationBar isLoggedIn={isLoggedIn} onLogout={onLogout} userType={userType} nombre={nombre} />
            <div className="container">
                {!cargando && herramientas.length > 0 && (
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                        <Route path="/contactanos" element={<Contactanos />} />
                        <Route path="/buscar" element={<Buscar herramientas={herramientas} isLoggedIn={isLoggedIn} userType={userType} />} />
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
                                <PrivateRoute isLoggedIn={isLoggedIn} userType={userType} allowedTypes={['1', '2']}>
                                    <Configuracion userId={userId} userType={userType} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/configuracion/cambiarcontrasena"
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn} userType={userType} allowedTypes={['1', '2', '3']}>
                                    <CambiarContrasena userId={userId} onClose={() => navigate('/configuracion')} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/crearusuario"
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn} userType={userType} allowedTypes={['1']}>
                                    <CrearUsuario onClose={() => navigate('/configuracion')} />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/agregar"
                            element={
                                <PrivateRoute isLoggedIn={isLoggedIn} userType={userType} allowedTypes={['1', '2']}>
                                    <Agregar />
                                </PrivateRoute>
                            }
                        />

                        {/* Otras rutas */}
                        <Route path="/qr/:id_articulo" element={<QRCodePage herramientas={herramientas} />} />
                        <Route
                            path="/herramienta/:id_articulo"
                            element={<HerramientaDetalle
                                onUpdateHerramienta={(updatedHerramienta) =>
                                    herramientas.map((herramienta) =>
                                        herramienta.id_articulo === updatedHerramienta.id_articulo ? updatedHerramienta : herramienta
                                    )
                                }
                                isLoggedIn={isLoggedIn}
                            />}
                        />
                        {/* Ruta por defecto */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                )}
                {cargando && (
                    <div style={{ textAlign: 'center', margin: '20px' }}>
                        <h1>Cargando...</h1>
                    </div>
                )}
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
    );
}

export default App;
