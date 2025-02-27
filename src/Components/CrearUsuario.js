import React, { useState, useEffect } from 'react';

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
        // Obtener el userId del localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
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
            // Enviar el userId en el header
            const response = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userId, // Usar el userId del estado
                },
                body: JSON.stringify(nuevoUsuario),
            });

            const data = await response.json();

            if (response.ok) {
                setMensajeExito('Usuario creado con éxito.');
                setMensajeError('');
                setNombre('');
                setUsuario('');
                setContraseña('');
                setVerificarContraseña('');
                 alert('Usuario creado con éxito');
                onClose();
            } else {
                setMensajeError(data.message || 'Error al crear el usuario. Por favor, inténtalo de nuevo.');
                setMensajeExito('');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensajeError('Error de conexión con el servidor.');
            setMensajeExito('');
        }
    };

    const handleGoBack = () => {
        onClose();
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
                <button type="button" onClick={handleGoBack}>Atrás</button>
            </form>
        </div>
    );
};

export default CrearUsuario;
