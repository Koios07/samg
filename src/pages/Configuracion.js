// src/pages/Configuracion.js
import React, { useState } from 'react';
import CrearUsuario from '../components/CrearUsuario';
import CambiarContrasena from '../components/CambiarContraseña';
import GestionarUsuario from '../components/GestionarUsuario';

const Configuracion = () => {
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
                <button onClick={handleCrearUsuarioClick}>Crear usuario</button>
                <button onClick={handleCambiarContrasenaClick}>Cambiar contraseña</button>
                <button onClick={handleGestionarUsuarioClick}>Gestionar usuario</button>
            </div>
            <div>
                {showCrearUsuario && <CrearUsuario onClose={() => setShowCrearUsuario(false)} />}
                {renderComponent()}
                {showCambiarContrasena && (
                    <CambiarContrasena onClose={() => setShowCambiarContrasena(false)} />
                )}
            </div>
        </div>
    );
};

export default Configuracion;
