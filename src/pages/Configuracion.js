import React, { useState, useEffect } from 'react';
import CrearUsuario from '../components/CrearUsuario';
import CambiarContrasena from '../components/CambiarContraseña';
import GestionarUsuario from '../components/GestionarUsuario';

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
        <div>
            <h1>Configuración</h1>
            <div>
                {userType === '1' && (
                    <>
                        <button onClick={handleCrearUsuarioClick}>Crear usuario</button>
                        <button onClick={handleGestionarUsuarioClick}>Gestionar usuario</button>
                    </>
                )}
                <button onClick={handleCambiarContrasenaClick}>Cambiar contraseña</button>
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
