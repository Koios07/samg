import React, { useState, useCallback } from 'react';
import CrearUsuario from '../components/CrearUsuario';
import CambiarContrasena from '../components/CambiarContraseña';
import GestionarUsuario from '../components/GestionarUsuario';
import DescargarPlantilla from '../components/DescargarPlantilla';
import CargarPlantilla from '../components/CargarPlantilla';
import Historial from '../components/Historial'; 
import './Configuracion.css';

const Configuracion = ({ userId, userType }) => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [showCrearUsuario, setShowCrearUsuario] = useState(false);
    const [showCambiarContrasena, setShowCambiarContrasena] = useState(false);
    const [showCargarHerramientasOpciones, setShowCargarHerramientasOpciones] = useState(false);
    const [showHistorial, setShowHistorial] = useState(false); // Estado para el componente Historial

    // Función para ocultar todos los componentes y opciones
    const hideAll = useCallback(() => {
        setShowCrearUsuario(false);
        setShowCambiarContrasena(false);
        setActiveComponent(null);
        setShowCargarHerramientasOpciones(false);
        setShowHistorial(false); // Asegúrate de ocultar el componente Historial
    }, [setShowCrearUsuario, setShowCambiarContrasena, setActiveComponent, setShowCargarHerramientasOpciones, setShowHistorial]);

    const handleCrearUsuarioClick = () => {
        hideAll(); // Ocultar todo antes de mostrar el componente
        setShowCrearUsuario(true);
    };

    const handleCambiarContrasenaClick = () => {
        hideAll(); // Ocultar todo antes de mostrar el componente
        setShowCambiarContrasena(true);
    };

    const handleGestionarUsuarioClick = () => {
        hideAll(); // Ocultar todo antes de mostrar el componente
        setActiveComponent('gestionarUsuario');
    };

    const handleCargarHerramientasClick = () => {
        hideAll(); // Ocultar todo antes de mostrar el componente
        setShowCargarHerramientasOpciones(true);
    };

    const handleHistorialClick = () => {
        hideAll(); // Ocultar todo antes de mostrar el componente
        setShowHistorial(true);
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'gestionarUsuario':
                return <GestionarUsuario />;
            default:
                return null;
        }
    };

    return (
        <div className="configuracion-container">
            <h1>Configuración</h1>
            <div className="botones-container">
                {userType === '1' && (
                    <>
                        <button onClick={handleCrearUsuarioClick} className="configuracion-button">Crear usuario</button>
                        <button onClick={handleGestionarUsuarioClick} className="configuracion-button">Gestionar usuario</button>
                        <button onClick={handleCargarHerramientasClick} className="configuracion-button">Cargar Herramientas</button>
                        <button onClick={handleHistorialClick} className="configuracion-button">Historial</button>
                    </>
                )}
                <button onClick={handleCambiarContrasenaClick} className="configuracion-button">Cambiar contraseña</button>
            </div>

            {showCargarHerramientasOpciones && (
                <div className="cargar-herramientas-opciones">
                    <DescargarPlantilla />
                    <CargarPlantilla />
                </div>
            )}

            {showHistorial && (
                <Historial /> // Renderiza el componente Historial
            )}

            <div>
                {userType === '1' && showCrearUsuario && <CrearUsuario onClose={() => setShowCrearUsuario(false)} />}
                {renderComponent()}
                {showCambiarContrasena && (
                    <CambiarContrasena onClose={() => setShowCambiarContrasena(false)} />
                )}
            </div>
        </div>
    );
};

export default Configuracion;
