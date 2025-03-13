import React, { useState, useEffect } from 'react';
import './CrearUsuario.css';

const CrearUsuario = ({ onClose }) => {
    const [nombre, setNombre] = useState('');
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [verificarContraseña, setVerificarContraseña] = useState('');
    const [tipo_usuario, setTipoUsuario] = useState('2');
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
            console.log('CrearUsuario - UserId obtenido del localStorage:', storedUserId);
        } else {
            console.log('CrearUsuario - No se encontró UserId en el localStorage.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreLimpio = nombre.trim();
        const usuarioLimpio = usuario.trim();
        const contraseñaLimpia = contraseña.trim();
        const verificarContraseñaLimpia = verificarContraseña.trim();

        if (!nombreLimpio || !usuarioLimpio || !contraseñaLimpia || !verificarContraseñaLimpia) {
            setMensajeError('Todos los campos son obligatorios.');
            setMensajeExito('');
            return;
        }

        if (contraseñaLimpia !== verificarContraseñaLimpia) {
            setMensajeError('Las contraseñas no coinciden.');
            setMensajeExito('');
            return;
        }

        const confirmCreation = window.confirm(
            `¿Crear usuario con nombre: ${nombreLimpio}, usuario: ${usuarioLimpio} y contraseña: ${contraseñaLimpia}?`
        );
        if (!confirmCreation) {
            return;
        }

        const nuevoUsuario = {
            nombre: nombreLimpio,
            username: usuarioLimpio,
            password: contraseñaLimpia,
            tipo_usuario: tipo_usuario,
        };

        try {
            console.log('CrearUsuario - Enviando solicitud a http://localhost:3001/registro');

            const response = await fetch('http://localhost:3001/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoUsuario),
            });

            console.log('CrearUsuario - Response status:', response.status);
            console.log('CrearUsuario - Response headers:', response.headers);

            if (response.ok) {
                try {
                    const data = await response.json();
                    console.log('CrearUsuario - Usuario creado con éxito:', data.message);
                    setMensajeExito('Usuario creado con éxito.');
                    setMensajeError('');
                    setNombre('');
                    setUsuario('');
                    setContraseña('');
                    setVerificarContraseña('');
                    alert('Usuario creado con éxito');
                    onClose();
                } catch (jsonError) {
                    console.error('CrearUsuario - Error al procesar la respuesta JSON:', jsonError);
                    setMensajeError('Error al procesar la respuesta del servidor.');
                    setMensajeExito('');
                }
            } else {
                let errorMessage = `Error al crear el usuario: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    console.error('CrearUsuario - Error al crear el usuario:', errorMessage);
                    setMensajeError(errorMessage);
                } catch (jsonError) {
                    console.error('CrearUsuario - Error al crear el usuario (JSON Error):', errorMessage);
                    setMensajeError(errorMessage);
                }
                setMensajeExito('');
                return;
            }
        } catch (error) {
            console.error('CrearUsuario - Error de conexión con el servidor:', error);
            setMensajeError('Error de conexión con el servidor.');
            setMensajeExito('');
        }
    };

    const handleGoBack = () => {
        onClose();
    };

    return (
        <div className="crear-usuario-container">
            <h2>Crear usuario</h2>
            {mensajeError && <p className="error-message">{mensajeError}</p>}
            {mensajeExito && <p className="success-message">{mensajeExito}</p>}
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
                        required
                    />
                </div>
                <div>
                    <label htmlFor="verificarContraseña">Verificar contraseña:</label>
                    <input
                        type="password"
                        id="verificarContraseña"
                        value={verificarContraseña}
                        onChange={(e) => setVerificarContraseña(e.target.value)}
                        required
                    />
                </div>
            </form>
              <div className="crear-usuario-buttons">
                    <button type="submit" className="crearUsuarioButton">Crear</button>
                    <button type="button" onClick={handleGoBack} className="atrasButton">Atrás</button>
                </div>
        </div>
    );
};

export default CrearUsuario;
