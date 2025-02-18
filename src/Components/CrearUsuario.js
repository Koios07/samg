// src/components/CrearUsuario.js
import React, { useState } from 'react';

const CrearUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [verificarContraseña, setVerificarContraseña] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre || !usuario || !contraseña || !verificarContraseña) {
      setMensajeError('Todos los campos son obligatorios.');
      setMensajeExito('');
      return;
    }

    if (contraseña !== verificarContraseña) {
      setMensajeError('Las contraseñas no coinciden.');
      setMensajeExito('');
      return;
    }

    // Crear objeto de usuario
    const nuevoUsuario = {
      nombre: nombre,
      username: usuario,
      password: contraseña,
      tipo_usuario: 2, // Tipo de usuario predeterminado
    };

    try {
      // Realizar la petición POST al backend
      const response = await fetch('http://localhost:3001/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        setMensajeExito('Usuario creado con éxito.');
        setMensajeError('');
        // Limpiar los campos después de crear el usuario
        setNombre('');
        setUsuario('');
        setContraseña('');
        setVerificarContraseña('');
      } else {
        setMensajeError('Error al crear el usuario.');
        setMensajeExito('');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeError('Error de conexión con el servidor.');
      setMensajeExito('');
    }
  };

  return (
    <div>
      <h2>Crear usuario</h2>
      {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
      {mensajeExito && <p style={{ color: 'green' }}>{mensajeExito}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contraseña">Contraseña:</label>
          <input
            type="password"
            id="contraseña"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="verificarContraseña">Verificar contraseña:</label>
          <input
            type="password"
            id="verificarContraseña"
            value={verificarContraseña}
            onChange={(e) => setVerificarContraseña(e.target.value)}
          />
        </div>
        <button type="submit">Crear usuario</button>
      </form>
    </div>
  );
};

export default CrearUsuario;
