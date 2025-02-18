// src/pages/Configuracion.js
import React, { useState } from 'react';
import CrearUsuario from '../components/CrearUsuario';
import CambiarContraseña from '../components/CambiarContraseña';
import GestionarUsuario from '../components/GestionarUsuario';

const Configuracion = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'crearUsuario':
        return <CrearUsuario />;
      case 'cambiarContraseña':
        return <CambiarContraseña />;
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
        <button onClick={() => setActiveComponent('crearUsuario')}>Crear usuario</button>
        <button onClick={() => setActiveComponent('cambiarContraseña')}>Cambiar contraseña</button>
        <button onClick={() => setActiveComponent('gestionarUsuario')}>Gestionar usuario</button>
      </div>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
};

export default Configuracion;
