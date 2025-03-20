import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            `¿Crear usuario con nombre: ${nombreLimpio}, usuario: ${usuarioLimpio}?`
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
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center">Crear usuario</h2>
                    {mensajeError && <p className="text-danger text-center">{mensajeError}</p>}
                    {mensajeExito && <p className="text-success text-center">{mensajeExito}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="usuario" className="form-label">Usuario:</label>
                            <input
                                type="text"
                                id="usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contraseña" className="form-label">Contraseña:</label>
                            <input
                                type="password"
                                id="contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="verificarContraseña" className="form-label">Verificar contraseña:</label>
                            <input
                                type="password"
                                id="verificarContraseña"
                                value={verificarContraseña}
                                onChange={(e) => setVerificarContraseña(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <button type="submit" className="btn btn-primary">Crear</button>
                            <button type="button" onClick={handleGoBack} className="btn btn-primary">Atrás</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearUsuario;
