import React, { useState, useEffect } from 'react';
import CrearUsuario from '../components/CrearUsuario';
import CambiarContrasena from '../components/CambiarContraseña';
import GestionarUsuario from '../components/GestionarUsuario';
import DescargarPlantilla from '../components/DescargarPlantilla';
import CargarPlantilla from '../components/CargarPlantilla';


const Configuracion = ({ userId, userType }) => {
    const [activeComponent, setActiveComponent] = useState(null);
    const [showCambiarContrasena, setShowCambiarContrasena] = useState(false);
    const [showCrearUsuario, setShowCrearUsuario] = useState(false);

    const handleCrearUsuarioClick = () => {
        setShowCrearUsuario(true);
        setShowCambiarContrasena(false);
        setActiveComponent(null); // Hide other components
    };

    const handleCambiarContrasenaClick = () => {
        setShowCambiarContrasena(true);
        setShowCrearUsuario(false);
        setActiveComponent(null); // Hide other components
    };

    const handleGestionarUsuarioClick = () => {
        setActiveComponent('gestionarUsuario');
        setShowCrearUsuario(false);
        setShowCambiarContrasena(false);
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
                        <DescargarPlantilla />
                        <CargarPlantilla />
                    </>
                )}
                <button onClick={handleCambiarContrasenaClick} className="configuracion-button">Cambiar contraseña</button>
            </div>
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
